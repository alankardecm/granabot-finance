import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  accountId: string;

  @IsEnum(TransactionType)
  tipo: TransactionType;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  categoria: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsDateString()
  dataLancamento: string;

  @IsOptional()
  @IsBoolean()
  estaPago?: boolean;

  @IsOptional()
  @IsString()
  origem?: string;

  @IsOptional()
  @IsString()
  identificadorExterno?: string;
}
