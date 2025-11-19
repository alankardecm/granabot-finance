import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeDateRange, parseDate } from '../../common/utils/date.util';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(userId: string, query: TransactionQueryDto) {
    const where = this.buildWhere(userId, query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        orderBy: { dataLancamento: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: data.map((transaction) => this.mapTransaction(transaction)),
      meta: { total, page, pageSize },
    };
  }

  async findLatest(userId: string, limit = 10) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return transactions.map((transaction) => this.mapTransaction(transaction));
  }

  async getMonthlyOverview(userId: string, accountId?: string) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        ...(accountId ? { accountId } : {}),
        dataLancamento: { gte: start, lte: end },
      },
      orderBy: { dataLancamento: 'asc' },
    });

    const overview = {
      receitas: 0,
      despesas: 0,
      saldo: 0,
      porCategoria: {} as Record<string, number>,
      timeline: [] as Array<{ date: string; receita: number; despesa: number; saldo: number }>,
    };

    const timelineMap: Record<string, { receita: number; despesa: number }> = {};

    transactions.forEach((transaction) => {
      const value = Number(transaction.valor);
      if (transaction.tipo === TransactionType.RECEITA) {
        overview.receitas += value;
      } else {
        overview.despesas += value;
      }

      overview.saldo = overview.receitas - overview.despesas;

      overview.porCategoria[transaction.categoria] =
        (overview.porCategoria[transaction.categoria] ?? 0) + value;

      const dayKey = transaction.dataLancamento.toISOString().split('T')[0];
      timelineMap[dayKey] ??= { receita: 0, despesa: 0 };
      if (transaction.tipo === TransactionType.RECEITA) {
        timelineMap[dayKey].receita += value;
      } else {
        timelineMap[dayKey].despesa += value;
      }
    });

    overview.timeline = Object.entries(timelineMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, item]) => ({
        date,
        ...item,
        saldo: item.receita - item.despesa,
      }));

    return overview;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    await this.ensureAccountOwnership(userId, dto.accountId);
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        accountId: dto.accountId,
        tipo: dto.tipo,
        descricao: dto.descricao,
        categoria: dto.categoria,
        valor: new Prisma.Decimal(dto.valor),
        dataLancamento: new Date(dto.dataLancamento),
        estaPago: dto.estaPago ?? true,
        origem: dto.origem ?? 'manual_web',
        identificadorExterno: dto.identificadorExterno,
      },
    });

    return this.mapTransaction(transaction);
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const transaction = await this.ensureTransaction(userId, id);
    if (dto.accountId && dto.accountId !== transaction.accountId) {
      await this.ensureAccountOwnership(userId, dto.accountId);
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...dto,
        valor: dto.valor !== undefined ? new Prisma.Decimal(dto.valor) : undefined,
        dataLancamento: dto.dataLancamento
          ? new Date(dto.dataLancamento)
          : undefined,
      },
    });

    return this.mapTransaction(updated);
  }

  async remove(userId: string, id: string) {
    await this.ensureTransaction(userId, id);
    await this.prisma.transaction.delete({ where: { id } });
    return { message: 'Transacao removida com sucesso.' };
  }

  private buildWhere(userId: string, query: TransactionQueryDto): Prisma.TransactionWhereInput {
    const where: Prisma.TransactionWhereInput = { userId };

    if (query.accountId) {
      where.accountId = query.accountId;
    }

    if (query.tipo) {
      where.tipo = query.tipo;
    }

    if (query.categoria) {
      where.categoria = query.categoria;
    }

    if (query.estaPago !== undefined) {
      where.estaPago = query.estaPago;
    }

    if (query.identificadorExterno) {
      where.identificadorExterno = query.identificadorExterno;
    }

    const start = parseDate(query.dataInicial);
    const end = parseDate(query.dataFinal);
    if (start || end) {
      const range = normalizeDateRange(start, end);
      where.dataLancamento = {
        ...(range.start ? { gte: range.start } : {}),
        ...(range.end ? { lte: range.end } : {}),
      };
    }

    return where;
  }

  private async ensureAccountOwnership(userId: string, accountId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) {
      throw new NotFoundException('Conta invalida para o usuario.');
    }
    return account;
  }

  private async ensureTransaction(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!transaction) {
      throw new NotFoundException('Transacao nao encontrada.');
    }
    return transaction;
  }

  private mapTransaction(transaction: Transaction) {
    return {
      ...transaction,
      valor: Number(transaction.valor),
    };
  }
}
