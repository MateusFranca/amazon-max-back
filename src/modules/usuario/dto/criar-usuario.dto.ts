import { IsNotEmpty, IsOptional, IsUUID, Length, IsString, IsEmail, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarUsuarioDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(10, 100, { message: 'Nome deve ter entre 10 e 100 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'Cargo não pode ser vazio' })
  @IsString({ message: 'Cargo deve ser uma string' })
  cargo: string;

  @IsNotEmpty({ message: 'E-mail não pode ser vazio' })
  @IsString({ message: 'E-mail deve ser uma strinSg' })
  @IsEmail({ require_tld: true }, { message: 'E-mail deve estar em formato correto' })
  email: string;

  @IsNotEmpty({ message: 'Senha não pode ser vazio' })
  @IsString({ message: 'Senha deve ser uma string' })
  @Length(8, 200, { message: 'Senha deve ter entre 8 e 200 caracteres' })
  senha: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Percentual de comissão deve ser um número válido (até 2 casas decimais)' },
  )
  @Min(0, { message: 'Percentual de comissão não pode ser menor que 0%' })
  @Max(100, { message: 'Percentual de comissão não pode ser maior que 100%' })
  percentual_comissao: number;
}
