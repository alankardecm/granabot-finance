import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, accountId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Conta nao encontrada.');
    }

    return account;
  }

  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        userId,
        nome: dto.nome,
        tipo: dto.tipo,
        moeda: dto.moeda ?? 'BRL',
        externalId: dto.externalId,
      },
    });
  }

  async update(userId: string, accountId: string, dto: UpdateAccountDto) {
    await this.findOne(userId, accountId);
    return this.prisma.account.update({
      where: { id: accountId },
      data: dto,
    });
  }

  async remove(userId: string, accountId: string) {
    await this.findOne(userId, accountId);
    await this.prisma.account.delete({ where: { id: accountId } });
    return { message: 'Conta removida com sucesso.' };
  }
}
