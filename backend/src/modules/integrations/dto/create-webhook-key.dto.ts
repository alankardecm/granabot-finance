import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWebhookKeyDto {
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}
