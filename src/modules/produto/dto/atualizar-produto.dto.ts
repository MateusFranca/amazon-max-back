import { IsString, IsOptional, IsDecimal, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export class FotoProdutoDTO {
  nomeImagem: string;
  urlImagem: string;
}

export class AtualizarProdutoDTO {
  @IsOptional()
  @IsString({ message: 'O campo marca deve ser uma string' })
  marca?: string;

  @IsOptional()
  @IsString({ message: 'O campo modelo deve ser uma string' })
  modelo?: string;

  @IsOptional()
  @IsDecimal({}, { message: 'O campo valor à vista deve ser um número decimal' })
  valor_vista?: Decimal;

  @IsOptional()
  @IsDecimal({}, { message: 'O campo valor completo deve ser um número decimal' })
  valor_completo?: Decimal;

  @IsOptional()
  @IsDecimal({}, { message: 'O campo valor médio deve ser um número decimal' })
  valor_medio?: Decimal;

  @IsOptional()
  @IsDecimal({}, { message: 'O campo valor reduzido deve ser um número decimal' })
  valor_reduzido?: Decimal;

  @IsOptional()
  @IsDecimal({}, { message: 'O campo valor exclusivo deve ser um número decimal' })
  valor_exclusivo?: Decimal;

  @IsOptional()
  @IsArray({ message: 'O campo foto deve ser um array de objetos JSON' })
  @ValidateNested({ each: true })
  foto?: FotoProdutoDTO[];

  @IsOptional()
  @IsString({ message: 'O campo descrição técnica deve ser uma string' })
  descricao_tecnica?: string;

  @IsOptional()
  @IsString({ message: 'O campo ID de usuário deve ser uma string' })
  id_usu_fk?: string;
}
