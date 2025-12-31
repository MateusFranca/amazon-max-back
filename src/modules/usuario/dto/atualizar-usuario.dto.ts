import { CriarUsuarioDTO } from './criar-usuario.dto';
import { PartialType } from '@nestjs/mapped-types';

export class AtualizarUsuarioDTO extends PartialType(CriarUsuarioDTO) {}
