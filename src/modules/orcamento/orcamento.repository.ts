import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { Orcamento, Prisma, Sincronizacao } from '@prisma/client';
import { CriarOrcamentoDto } from './dto/criar-orcamento.dto';

@Injectable()
export class OrcamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dados: Prisma.OrcamentoCreateInput): Promise<Orcamento> {
    return this.prisma.orcamento.create({
      data: dados,
    });
  }

  async atualizar(id: string, dados: Partial<Prisma.OrcamentoUncheckedUpdateInput>): Promise<Orcamento> {
    return this.prisma.orcamento.update({
      where: { id },
      data: dados,
    });
  }

  async buscarTodos(
    deslocamento: number,
    tamanhoPagina: number,
    textoBusca: string,
    usuarioId?: string,
  ): Promise<Orcamento[]> {
    return this.prisma.orcamento.findMany({
      where: {
        OR: [
          { forma_pagamento: { contains: textoBusca } },
          {
            produtosOrcamento: {
              some: { produto: { modelo: { contains: textoBusca } } },
            },
          },
        ],
        ...(usuarioId && { id_usu_fk: usuarioId }),
      },
      include: {
        cliente: true,
        produtosOrcamento: { include: { produto: true } },
      },
      skip: deslocamento,
      take: tamanhoPagina,
      orderBy: { criadoEm: 'desc' },
    });
  }

  async buscarUm(id: string): Promise<Orcamento | null> {
    return this.prisma.orcamento.findUnique({
      where: { id },
      include: {
        cliente: true,
        produtosOrcamento: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async ativar(id: string): Promise<void> {
    await this.prisma.orcamento.update({
      where: { id },
      data: { deletadoEm: null },
    });
  }

  async remover(id: string): Promise<void> {
    await this.prisma.orcamento.update({
      where: { id },
      data: { deletadoEm: new Date() },
    });
  }

  async existe(id: string): Promise<boolean> {
    const orcamento = await this.prisma.orcamento.findUnique({ where: { id } });
    return !!orcamento;
  }

  async contador(textoBusca: string, usuarioId?: string): Promise<number> {
    return this.prisma.orcamento.count({
      where: {
        OR: [{ forma_pagamento: { contains: textoBusca } }],
        ...(usuarioId && { id_usu_fk: usuarioId }),
      },
    });
  }

  async contadorAtivo(textoBusca: string): Promise<number> {
    return this.prisma.orcamento.count({
      where: {
        OR: [{ forma_pagamento: { contains: textoBusca } }],
        deletadoEm: null,
      },
    });
  }

  async buscarAtivos(deslocamento: number, tamanhoPagina: number, textoBusca: string): Promise<Orcamento[]> {
    return this.prisma.orcamento.findMany({
      where: {
        OR: [{ forma_pagamento: { contains: textoBusca } }],
        deletadoEm: null,
      },
      include: {
        produtosOrcamento: true,
        cliente: true,
      },
      skip: deslocamento,
      take: tamanhoPagina,
      orderBy: [{ criadoEm: 'desc' }],
    });
  }

  // Sincronização de versão

  async buscarDessincronizadosServidor(lista: { id: string; versao: number }[]): Promise<any[]> {
    const ids = lista.map((item) => item.id);
    const versoesMap = Object.fromEntries(lista.map((item) => [item.id, item.versao]));

    // Busca todos os orçamentos cujos ids estão na lista e cuja versão é maior que a informada
    const orcamentos = await this.prisma.orcamento.findMany({
      where: {
        id: { in: ids },
        versao: { not: null },
      },
      select: {
        id: true,
        id_cli_fk: true,
        id_usu_fk: true,
        percentual_comissao: true,
        valor_final: true,
        forma_pagamento: true,
        prazo: true,
        observacao: true,
        parcelas: true,
        codigo_finame: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
        versao: true,
        cliente: { select: { id: true } },
        produtosOrcamento: {
          select: {
            valor_unitario: true,
            valor_final_unitario: true,
            quantidade: true,
            produto: { select: { id: true } },
          },
        },
      },
    });

    // Retorna os orçamentos filtrados e convertidos para o formato com connect
    return orcamentos
      .filter((o) => (o.versao ?? 0) > (versoesMap[o.id] ?? 0))
      .map((o) => ({
        id: o.id,
        id_cli_fk: o.id_cli_fk,
        id_usu_fk: o.id_usu_fk,
        percentual_comissao: o.percentual_comissao,
        valor_final: o.valor_final,
        forma_pagamento: o.forma_pagamento,
        prazo: o.prazo,
        observacao: o.observacao,
        parcelas: o.parcelas,
        codigo_finame: o.codigo_finame,
        criadoEm: o.criadoEm,
        atualizadoEm: o.atualizadoEm,
        deletadoEm: o.deletadoEm,
        versao: o.versao,
        cliente: o.cliente ? { connect: { id: o.cliente.id } } : undefined,
        produtosOrcamento: {
          create: o.produtosOrcamento.map((po) => ({
            valor_unitario: po.valor_unitario,
            valor_final_unitario: po.valor_final_unitario,
            quantidade: po.quantidade,
            produto: { connect: { id: po.produto.id } },
          })),
        },
        valor_comissao: o.percentual_comissao
          ? (Number(o.valor_final) * (Number(o.percentual_comissao) / 100))
          : undefined,
      }));
  }

  async buscarDesconhecidos(): Promise<Orcamento[]> {
    return this.prisma.orcamento.findMany({
      where: { versao: null },
      include: {
        cliente: true,
        produtosOrcamento: { include: { produto: true } },
        usuario: true,
      },
    });
  }

  async buscarParaRelatorio(usuarioId?: string, dataInicial?: string, dataFinal?: string): Promise<Orcamento[]> {
    return this.prisma.orcamento.findMany({
      where: {
        ...(usuarioId && { id_usu_fk: usuarioId }),
        ...(dataInicial && { criadoEm: { gte: new Date(dataInicial) } }),
        ...(dataFinal && {
          criadoEm: {
            lte: (() => {
              const [ano, mes, dia] = dataFinal.split('-').map(Number);
              return new Date(Date.UTC(ano, mes - 1, dia, 27, 59, 59, 999));
            })(),
          },
        }),
      },
      include: {
        produtosOrcamento: {
          include: { produto: true },
        },
        cliente: {
          include: {
            endereco: {
              include: {
                cidade: {
                  include: {
                    estado: true,
                  },
                },
              },
            },
          },
        },
        usuario: true,
      },
      orderBy: [{ criadoEm: 'desc' }],
    });
  }

  async buscarDessincronizadosLocal(
    versao: boolean = false,
    id: string,
    textoBusca: string = '',
    usuarioId?: string,
    deslocamento: number = 0,
    tamanhoPagina: number = 10,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    if (versao) {
      return this.prisma.orcamento.findMany({
        where: {
          OR: [
            { forma_pagamento: { contains: textoBusca } },
            {
              produtosOrcamento: {
                some: { produto: { modelo: { contains: textoBusca } } },
              },
            },
          ],
          versao: { not: null },
          ...(usuarioId && { id_usu_fk: usuarioId }),
          ...(id && { id }),
        },
        select: {
          id: true,
          versao: true,
        },
        skip: deslocamento,
        take: tamanhoPagina,
        orderBy: { criadoEm: 'desc' },
      });
    } else {
      const where: any = { versao: null };
      if (id) where.id = id;

      const orcamentos = await this.prisma.orcamento.findMany({
        where,
        include: {
          produtosOrcamento: true,
        },
        skip: deslocamento,
        take: tamanhoPagina,
        orderBy: { criadoEm: 'desc' },
      });

      return orcamentos.map((orcamento) => ({
        id: orcamento.id,
        id_cli_fk: orcamento.id_cli_fk,
        id_usu_fk: orcamento.id_usu_fk,
        percentual_comissao: orcamento.percentual_comissao,
        valor_final: orcamento.valor_final,
        forma_pagamento: orcamento.forma_pagamento,
        prazo: orcamento.prazo,
        observacao: orcamento.observacao,
        parcelas: orcamento.parcelas,
        codigo_finame: orcamento.codigo_finame,
        criadoEm: orcamento.criadoEm,
        atualizadoEm: orcamento.atualizadoEm,
        deletadoEm: orcamento.deletadoEm,
        versao: orcamento.versao,
        produtosOrcamento: {
          create: orcamento.produtosOrcamento.map((produto) => ({
            valor_unitario: produto.valor_unitario,
            valor_final_unitario: produto.valor_final_unitario,
            quantidade: produto.quantidade,
            produto: { connect: { id: produto.id_pro_fk } },
          })),
        },
      }));
    }
  }

  async buscarAtualizacoesLocal(
    sincronizacao: Sincronizacao,
    textoBusca: string = '',
    usuarioId?: string,
    deslocamento: number = 0,
    tamanhoPagina: number = 10,
  ): Promise<any[]> {
    if (!sincronizacao || !sincronizacao.orcamento) {
      return [];
    }

    return this.prisma.orcamento.findMany({
      where: {
        OR: [
          { forma_pagamento: { contains: textoBusca } },
          {
            produtosOrcamento: {
              some: { produto: { modelo: { contains: textoBusca } } },
            },
          },
        ],
        versao: { not: null },
        atualizadoEm: { gt: sincronizacao.orcamento },
        ...(usuarioId && { id_usu_fk: usuarioId }),
      },
      select: {
        id: true,
        id_cli_fk: true,
        id_usu_fk: true,
        percentual_comissao: true,
        valor_final: true,
        forma_pagamento: true,
        prazo: true,
        observacao: true,
        parcelas: true,
        codigo_finame: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
        versao: true,
      },
      skip: deslocamento,
      take: tamanhoPagina,
      orderBy: { atualizadoEm: 'desc' },
    });
  }
}
