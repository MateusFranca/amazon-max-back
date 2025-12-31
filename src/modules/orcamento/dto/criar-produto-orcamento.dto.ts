import { IsString, IsNotEmpty, IsDecimal, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export class CriarProdutoOrcamentoDto {
  @IsString({ message: 'O campo id_orc_fk deve ser uma string' })
  @IsNotEmpty({ message: 'O campo id_orc_fk não pode estar vazio' })
  id_orc_fk: string;

  @IsString({ message: 'O campo id_pro_fk deve ser uma string' })
  @IsNotEmpty({ message: 'O campo id_pro_fk não pode estar vazio' })
  id_pro_fk: string;

  @IsNotEmpty({ message: 'O campo valor_unitario não pode estar vazio' })
  @IsDecimal({}, { message: 'O campo valor_unitario deve ser um decimal' })
  valor_unitario: Decimal;

  @IsNotEmpty({ message: 'O campo valor_final_unitario não pode estar vazio' })
  @IsDecimal({}, { message: 'O campo valor_final_unitario deve ser um decimal' })
  valor_final_unitario: Decimal;

  @IsNotEmpty({ message: 'O campo quantidade não pode estar vazio' })
  @IsNumber({}, { message: 'O campo quantidade deve ser um número' })
  quantidade: number;
}
