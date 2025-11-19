import { Module } from '@nestjs/common';
import { IntegrationConfigController } from './integration-config.controller';
import { WebhookKeysController } from './webhook-keys.controller';
import { IntegrationConfigService } from './integration-config.service';
import { WebhookKeysService } from './webhook-keys.service';

@Module({
  controllers: [IntegrationConfigController, WebhookKeysController],
  providers: [IntegrationConfigService, WebhookKeysService],
  exports: [IntegrationConfigService, WebhookKeysService],
})
export class IntegrationsModule {}
