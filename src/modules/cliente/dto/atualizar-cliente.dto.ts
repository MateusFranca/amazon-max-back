import { CriarClienteDTO } from './criar-cliente.dto';
import { PartialType } from '@nestjs/mapped-types';

export class AtualizarClienteDTO extends PartialType(CriarClienteDTO) {}
