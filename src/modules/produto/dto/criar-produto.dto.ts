import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsNumber, IsDecimal, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export class CriarProdutoDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString({ message: 'O campo marca deve ser uma string' })
  @IsNotEmpty({ message: 'O campo marca não pode estar vazio' })
  marca: string;

  @IsString({ message: 'O campo modelo deve ser uma string' })
  @IsNotEmpty({ message: 'O campo modelo não pode estar vazio' })
  modelo: string;

  @IsNotEmpty({ message: 'O campo valor completo não pode estar vazio' })
  @IsDecimal({}, { message: 'O campo valor completo deve ser um decimal' })
  valor_completo: Decimal;

  @IsNotEmpty({ message: 'O campo valor médio não pode estar vazio' })
  @IsDecimal({}, { message: 'O campo valor médio deve ser um decimal' })
  valor_medio: Decimal;

  @IsNotEmpty({ message: 'O campo valor reduzido não pode estar vazio' })
  @IsDecimal({}, { message: 'O campo valor reduzido deve ser um decimal' })
  valor_reduzido: Decimal;

  @IsNotEmpty({ message: 'O campo valor exclusivo não pode estar vazio' })
  @IsDecimal({}, { message: 'O campo valor exclusivo deve ser um decimal' })
  valor_exclusivo: Decimal;

  @IsOptional()
  @IsObject({ message: 'O campo foto deve ser um objeto JSON' })
  foto?: Record<string, any>;

  @IsString({ message: 'O campo descrição técnica deve ser uma string' })
  @IsNotEmpty({ message: 'O campo descrição técnica não pode estar vazio' })
  descricao_tecnica: string;

  @IsString({ message: 'O campo ID de usuário deve ser uma string' })
  @IsNotEmpty({ message: 'O campo ID do usuário não pode estar vazio' })
  id_usu_fk: string;
}
