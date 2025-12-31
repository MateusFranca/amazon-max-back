import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { IsUuidExists } from 'src/commons/decorators/uuid-exists.decorator';

export class CriarEnderecoDTO {
  @IsOptional()
  @IsUUID(4, { message: 'O ID do endereço deve ser um UUID válido' })
  @ApiProperty()
  id?: string;

  @IsString({ message: 'A rua deve ser uma string' })
  @ApiProperty()
  rua: string;

  @IsString({ message: 'O bairro deve ser uma string' })
  @ApiProperty()
  bairro: string;

  @IsString({ message: 'O CEP deve ser uma string' })
  @ApiProperty()
  cep: string;

  @IsString({ message: 'O número deve ser uma string' })
  @ApiProperty()
  numero: string;

  @IsString({ message: 'O complemento deve ser uma string' })
  @IsOptional()
  @ApiProperty()
  complemento?: string;

  @ApiProperty()
  @IsOptional()
  versao?: number;

  @IsString({ message: 'O ID da cidade deve ser uma string' })
  @IsUuidExists({ message: 'Cidade não encontrada.' })
  @ApiProperty()
  id_cid_fk: string;
}
