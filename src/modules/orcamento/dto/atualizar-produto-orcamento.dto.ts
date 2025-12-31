import { PartialType } from '@nestjs/mapped-types';
import { CriarProdutoOrcamentoDto } from './criar-produto-orcamento.dto';

export class AtualizarProdutoOrcamentoDto extends PartialType(CriarProdutoOrcamentoDto) {}
