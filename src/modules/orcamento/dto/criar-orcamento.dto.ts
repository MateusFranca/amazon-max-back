import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDecimal, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { ApiProperty } from '@nestjs/swagger';

export class CriarOrcamentoDto {
  @IsOptional()
  @IsUUID(4, { message: 'O ID do endereço deve ser um UUID válido' })
  @ApiProperty()
  id?: string;

  @IsNotEmpty({ message: 'O campo valor_final não pode estar vazio' })
  @IsDecimal({}, { message: 'O campo valor_final deve ser um decimal' })
  @ApiProperty()
  valor_final: Decimal;

  @IsOptional()
  @IsString({ message: 'O campo observação deve ser uma string' })
  @ApiProperty()
  observacao?: string;

  @IsOptional()
  @IsString({ message: 'O campo prazo deve ser uma string' })
  @ApiProperty()
  prazo: string;

  @IsOptional()
  @IsString({ message: 'O campo forma_pagamento deve ser uma string' })
  @ApiProperty()
  forma_pagamento?: string;

  @IsString({ message: 'O campo id_cli_fk deve ser uma string' })
  @IsNotEmpty({ message: 'O campo id_cli_fk não pode estar vazio' })
  @ApiProperty()
  id_cli_fk: string;

  @IsString({ message: 'O campo id_usu_fk deve ser uma string' })
  @IsNotEmpty({ message: 'O campo id_usu_fk não pode estar vazio' })
  @ApiProperty()
  id_usu_fk: string;
}
