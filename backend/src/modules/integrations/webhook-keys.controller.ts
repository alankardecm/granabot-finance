import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateWebhookKeyDto } from './dto/create-webhook-key.dto';
import { WebhookKeysService } from './webhook-keys.service';

@ApiTags('Integrations')
@Controller('integrations/webhook-keys')
export class WebhookKeysController {
  constructor(private readonly webhookKeysService: WebhookKeysService) {}

  @Get()
  list(@CurrentUser('sub') userId: string) {
    return this.webhookKeysService.list(userId);
  }

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateWebhookKeyDto) {
    return this.webhookKeysService.create(userId, dto);
  }

  @Post(':id/rotate')
  rotate(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.webhookKeysService.rotate(userId, id);
  }
}
