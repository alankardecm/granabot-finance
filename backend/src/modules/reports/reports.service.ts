import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import axios from 'axios';
import PDFDocument from 'pdfkit';
import { normalizeDateRange } from '../../common/utils/date.util';
import { PrismaService } from '../../prisma/prisma.service';
import { IntegrationConfigService } from '../integrations/integration-config.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { SendWhatsappDto } from './dto/send-whatsapp.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrationConfigService: IntegrationConfigService,
  ) {}

  async generatePdf(userId: string, dto: GenerateReportDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    let accountName = 'Todas as contas';
    if (dto.accountId) {
      const account = await this.prisma.account.findFirst({
        where: { id: dto.accountId, userId },
      });
      if (!account) {
        throw new NotFoundException('Conta nao encontrada.');
      }
      accountName = account.nome;
    }

    const range = normalizeDateRange(new Date(dto.dataInicial), new Date(dto.dataFinal));
    if (!range.start || !range.end) {
      throw new BadRequestException('Periodo invalido.');
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        ...(dto.accountId ? { accountId: dto.accountId } : {}),
        dataLancamento: {
          gte: range.start,
          lte: range.end,
        },
      },
      orderBy: { dataLancamento: 'asc' },
    });

    const resumo = transactions.reduce(
      (acc, transaction) => {
        const value = Number(transaction.valor);
        if (transaction.tipo === TransactionType.RECEITA) {
          acc.receitas += value;
        } else {
          acc.despesas += value;
        }
        return acc;
      },
      { receitas: 0, despesas: 0 },
    );
    const saldo = resumo.receitas - resumo.despesas;

    const buffer = await this.buildPdf({
      user,
      accountName,
      transactions,
      range,
      resumo: { ...resumo, saldo },
    });

    const filename = `extrato-${accountName.replace(/\s+/g, '-').toLowerCase()}-${dto.dataInicial}-a-${dto.dataFinal}.pdf`;

    return {
      buffer,
      filename,
      resumo: { ...resumo, saldo },
    };
  }

  async sendWhatsappReport(userId: string, dto: SendWhatsappDto) {
    const { dataInicial, dataFinal, accountId } = dto;
    const { buffer, filename } = await this.generatePdf(userId, {
      dataInicial,
      dataFinal,
      accountId,
    });
    const integrationConfig = await this.integrationConfigService.getConfig(userId);

    if (!integrationConfig?.whatsappWebhookUrl) {
      throw new BadRequestException('Configure uma URL de webhook do WhatsApp nas configuracoes.');
    }

    await axios.post(
      integrationConfig.whatsappWebhookUrl,
      {
        numero: dto.numero,
        mensagem: `Segue o seu extrato do periodo ${dataInicial} a ${dataFinal}.`,
        arquivo: {
          nome: filename,
          conteudo_base64: buffer.toString('base64'),
        },
      },
      {
        headers: integrationConfig.whatsappApiToken
          ? { Authorization: `Bearer ${integrationConfig.whatsappApiToken}` }
          : undefined,
      },
    );

    return { message: 'Extrato enviado para o WhatsApp com sucesso.' };
  }

  private buildPdf({
    user,
    accountName,
    transactions,
    range,
    resumo,
  }: {
    user: { nome: string; email: string };
    accountName: string;
    transactions: Transaction[];
    range: { start?: Date; end?: Date };
    resumo: { receitas: number; despesas: number; saldo: number };
  }) {
    return new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text('Extrato Financeiro', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Usuario: ${user.nome} (${user.email})`);
      doc.text(`Conta: ${accountName}`);
      doc.text(
        `Periodo: ${range.start?.toLocaleDateString()} - ${range.end?.toLocaleDateString()}`,
      );
      doc.moveDown();

      doc.fontSize(14).text('Resumo');
      doc.fontSize(12).text(`Receitas: R$ ${resumo.receitas.toFixed(2)}`);
      doc.text(`Despesas: R$ ${resumo.despesas.toFixed(2)}`);
      doc.text(`Saldo: R$ ${resumo.saldo.toFixed(2)}`);
      doc.moveDown();

      doc.fontSize(14).text('Transacoes');
      doc.moveDown(0.5);
      transactions.forEach((transaction) => {
        doc
          .fontSize(12)
          .text(
            `${transaction.dataLancamento.toLocaleDateString()} | ${transaction.descricao} | ${transaction.categoria} | ${transaction.tipo} | R$ ${Number(transaction.valor).toFixed(2)} | ${transaction.estaPago ? 'Pago' : 'Pendente'}`,
          );
      });

      if (transactions.length === 0) {
        doc.fontSize(12).text('Nenhuma transacao encontrada para o periodo.');
      }

      doc.end();
    });
  }
}
