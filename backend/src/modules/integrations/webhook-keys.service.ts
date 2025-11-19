import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWebhookKeyDto } from './dto/create-webhook-key.dto';

@Injectable()
export class WebhookKeysService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.webhookKey.findMany({
      where: { userId },
      include: { account: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateWebhookKeyDto) {
    await this.ensureAccount(userId, dto.accountId);
    const chave = this.generateKey();
    return this.prisma.webhookKey.create({
      data: {
        userId,
        accountId: dto.accountId,
        descricao: dto.descricao,
        chave,
      },
    });
  }

  async rotate(userId: string, keyId: string) {
    const existing = await this.prisma.webhookKey.findFirst({
      where: { id: keyId, userId },
    });
    if (!existing) {
      throw new NotFoundException('Chave nao encontrada.');
    }

    await this.prisma.webhookKey.update({
      where: { id: keyId },
      data: { ativo: false },
    });

    return this.prisma.webhookKey.create({
      data: {
        userId: existing.userId,
        accountId: existing.accountId,
        descricao: existing.descricao,
        chave: this.generateKey(),
      },
    });
  }

  findActiveKey(chave: string) {
    return this.prisma.webhookKey.findFirst({
      where: { chave, ativo: true },
      include: {
        account: true,
        user: true,
      },
    });
  }

  private generateKey() {
    return randomBytes(32).toString('hex');
  }

  private async ensureAccount(userId: string, accountId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) {
      throw new NotFoundException('Conta nao encontrada para este usuario.');
    }
    return account;
  }
}
