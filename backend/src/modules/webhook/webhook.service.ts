import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WebhookKeysService } from '../integrations/webhook-keys.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { N8nTransactionDto } from './dto/n8n-transaction.dto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly webhookKeysService: WebhookKeysService,
    private readonly prisma: PrismaService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async ingestTransaction(headerKey: string | undefined, payload: N8nTransactionDto) {
    if (!headerKey) {
      throw new UnauthorizedException('Webhook key is required.');
    }

    const webhookKey = await this.webhookKeysService.findActiveKey(headerKey);
    if (!webhookKey) {
      throw new UnauthorizedException('Webhook key invalid.');
    }

    let accountId = webhookKey.accountId;
    if (payload.account_external_id) {
      const account = await this.prisma.account.findFirst({
        where: {
          externalId: payload.account_external_id,
          userId: webhookKey.userId,
        },
      });
      if (account) {
        accountId = account.id;
      }
    }

    const normalizedType = this.normalizeType(payload.tipo);

    const dto: CreateTransactionDto = {
      accountId,
      tipo: normalizedType,
      descricao: payload.descricao,
      categoria: payload.categoria ?? 'Outros',
      valor: payload.valor,
      dataLancamento: payload.data_lancamento,
      estaPago: payload.esta_pago ?? true,
      origem: 'n8n_webhook',
      identificadorExterno: payload.identificador_externo,
    };

    const transaction = await this.transactionsService.create(
      webhookKey.userId,
      dto,
    );

    return transaction;
  }

  private normalizeType(tipo: string) {
    const normalized = tipo?.toLowerCase();
    return normalized === 'receita' ? TransactionType.RECEITA : TransactionType.DESPESA;
  }
}
