import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateIntegrationConfigDto {
  @IsOptional()
  @IsUrl()
  whatsappWebhookUrl?: string;

  @IsOptional()
  @IsString()
  whatsappApiToken?: string;
}
