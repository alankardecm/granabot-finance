import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class TransactionQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  tipo?: TransactionType;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsDateString()
  dataInicial?: string;

  @IsOptional()
  @IsDateString()
  dataFinal?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  estaPago?: boolean;

  @IsOptional()
  @IsString()
  identificadorExterno?: string;
}
