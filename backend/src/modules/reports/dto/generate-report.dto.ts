import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class GenerateReportDto {
  @IsDateString()
  dataInicial: string;

  @IsDateString()
  dataFinal: string;

  @IsOptional()
  @IsUUID()
  accountId?: string;
}
