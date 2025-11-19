import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class N8nTransactionDto {
  @IsOptional()
  @IsString()
  account_external_id?: string;

  @IsString()
  tipo: string;

  @IsString()
  descricao: string;

  @IsString()
  categoria: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsDateString()
  data_lancamento: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  esta_pago?: boolean;

  @IsOptional()
  @IsString()
  identificador_externo?: string;
}
