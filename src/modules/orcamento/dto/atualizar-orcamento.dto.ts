import { PartialType } from '@nestjs/mapped-types';
import { CriarOrcamentoDto } from './criar-orcamento.dto';

export class AtualizarOrcamentoDto extends PartialType(CriarOrcamentoDto) {}
