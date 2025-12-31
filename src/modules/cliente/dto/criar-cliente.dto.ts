import { IsNotEmpty, IsOptional, IsUUID, Length, IsString } from 'class-validator';
import { IsCpfValid } from '../../../commons/validators/cpf-is-valid.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarClienteDTO {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id?: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString({ message: 'Nome deve ser uma string' })
    @Length(3, 100, { message: 'Nome deve ter entre 3 e 100 caracteres' })
    nome: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'CPF é obrigatório' })
    @IsString({ message: 'CPF deve ser uma string' })
    documento: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Telefone é obrigatório' })
    @IsString({ message: 'Telefone deve ser uma string' })
    telefone: string;

    @IsOptional()
    @IsString({ message: 'O campo nascimento deve ser uma string' })
    nascimento: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'ID do endereço é obrigatório' })
    id_end_fk: string;
}
