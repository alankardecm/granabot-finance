import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  telefone?: string;

  @IsOptional()
  @IsString()
  plano?: string;
}
