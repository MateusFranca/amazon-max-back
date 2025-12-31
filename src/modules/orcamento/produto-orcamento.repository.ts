import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { ProdutoOrcamento, Prisma } from '@prisma/client';

@Injectable()
export class ProdutoOrcamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: Prisma.ProdutoOrcamentoCreateInput): Promise<ProdutoOrcamento> {
    if (!dados.produto || !dados.orcamento) {
      throw new Error('Produto e Orçamento são obrigatórios para criar um ProdutoOrcamento');
    }
    return this.prisma.produtoOrcamento.create({ data: dados });
  }

  async buscarPorOrcamento(id_orc_fk: string): Promise<ProdutoOrcamento[]> {
    return this.prisma.produtoOrcamento.findMany({
      where: { id_orc_fk },
      include: { produto: true },
    });
  }

  async buscarUm(id: string): Promise<ProdutoOrcamento | null> {
    return this.prisma.produtoOrcamento.findUnique({
      where: { id },
      include: { orcamento: true, produto: true },
    });
  }

  async atualizar(id: string, dados: Prisma.ProdutoOrcamentoUpdateInput): Promise<ProdutoOrcamento> {
    return this.prisma.produtoOrcamento.update({
      where: { id },
      data: dados,
    });
  }

  async remover(id: string): Promise<void> {
    await this.prisma.produtoOrcamento.delete({ where: { id } });
  }

  async existe(id: string): Promise<boolean> {
    if (!id) {
        console.error("ProdutoOrcamentoRepository.existe: 'id' is null or undefined.", { id });
        throw new Error("The 'id' parameter must not be null or undefined. Please provide a valid 'id'.");
    }

    const produtoOrcamento = await this.prisma.produtoOrcamento.findUnique({
        where: {
            id: String(id),
        },
    });

    return !!produtoOrcamento;
  }
}
