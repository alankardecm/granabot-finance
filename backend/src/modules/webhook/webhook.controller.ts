import { Body, Controller, Headers, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { WebhookService } from './webhook.service';
import { N8nTransactionDto } from './dto/n8n-transaction.dto';

@ApiTags('Webhooks')
@Controller('webhook/n8n')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Public()
  @Post('transactions')
  @Throttle({ webhook: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async ingestTransaction(
    @Headers('x-webhook-key') webhookKey: string,
    @Body() dto: N8nTransactionDto,
  ) {
    console.log('Webhook Request Received:', { webhookKey, dto });
    return this.webhookService.ingestTransaction(webhookKey, dto);
  }
}
