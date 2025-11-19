import { Module } from '@nestjs/common';
import { IntegrationsModule } from '../integrations/integrations.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [IntegrationsModule, TransactionsModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
