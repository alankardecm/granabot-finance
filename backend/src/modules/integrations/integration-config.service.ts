import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateIntegrationConfigDto } from './dto/update-integration-config.dto';

@Injectable()
export class IntegrationConfigService {
  constructor(private readonly prisma: PrismaService) {}

  getConfig(userId: string) {
    return this.prisma.integrationConfig.findUnique({ where: { userId } });
  }

  upsert(userId: string, dto: UpdateIntegrationConfigDto) {
    return this.prisma.integrationConfig.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }
}
