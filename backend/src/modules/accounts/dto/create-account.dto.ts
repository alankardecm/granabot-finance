import { IsOptional, IsString, Length } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @Length(2, 50)
  nome: string;

  @IsString()
  tipo: string;

  @IsOptional()
  @IsString()
  moeda?: string;

  @IsOptional()
  @IsString()
  externalId?: string;
}
