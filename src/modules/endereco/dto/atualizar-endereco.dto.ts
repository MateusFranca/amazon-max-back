import { PartialType } from '@nestjs/mapped-types';
import { CriarEnderecoDTO } from './criar-endereco.dto';

export class AtualizarEnderecoDTO extends PartialType(CriarEnderecoDTO) {}
