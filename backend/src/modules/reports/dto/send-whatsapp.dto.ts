import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendWhatsappDto {
  @IsDateString()
  dataInicial: string;

  @IsDateString()
  dataFinal: string;

  @IsString()
  numero: string;

  @IsOptional()
  @IsUUID()
  accountId?: string;
}
