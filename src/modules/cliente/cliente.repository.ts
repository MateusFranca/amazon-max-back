import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { CriarClienteDTO } from './dto/criar-cliente.dto';
import { AtualizarClienteDTO } from './dto/atualizar-cliente.dto';
import { Cliente, Sincronizacao } from '@prisma/client';

@Injectable()
export class ClienteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: CriarClienteDTO) {
    return await this.prisma.cliente.create({ data });
  }

  async buscarTodos(pagina: number, tamanhoPagina: number, textoBusca: string): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: {
        OR: [{ nome: { contains: textoBusca } }],
      },
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
      skip: pagina,
      take: tamanhoPagina,
      orderBy: {
        deletadoEm: 'desc',
      },
    });
  }

  async contador(buscarTexto: string): Promise<number> {
    return this.prisma.usuario.count({
      where: {
        deletadoEm: null,
        OR: [{ nome: { contains: buscarTexto } }],
      },
    });
  }

  async buscarUm(id: string) {
    return await this.prisma.cliente.findUnique({
      where: { id },
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
    });
  }

  async listarPorNome() {
    return await this.prisma.cliente.findMany({
      select: {
        id: true,
        nome: true,
        documento: true,
        telefone: true,
        nascimento: true,
        atualizadoEm: true,
        deletadoEm: true,
        endereco: {
          select: {
            id: true,
            rua: true,
            numero: true,
            bairro: true,
            cep: true,
            cidade: {
              select: {
                id: true,
                nome: true,
                estado: {
                  select: {
                    id: true,
                    nome: true,
                    uf: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async listarPorNomePorIds(ids: string[], atualizadosArray: string[]) {
    const clientesDb = await this.prisma.cliente.findMany({
      select: {
        id: true,
        nome: true,
        documento: true,
        telefone: true,
        nascimento: true,
        atualizadoEm: true,
        endereco: {
          select: {
            id: true,
            rua: true,
            numero: true,
            bairro: true,
            cep: true,
            cidade: {
              select: {
                id: true,
                nome: true,
                estado: {
                  select: {
                    id: true,
                    nome: true,
                    uf: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!ids || ids.length === 0) {
      return clientesDb;
    }

    const atualizadoMap = new Map<string, string>();
    ids.forEach((id, idx) => {
      if (id) atualizadoMap.set(id, atualizadosArray[idx]);
    });

    const clientesParaRetornar = clientesDb.filter((cli) => {
      if (!atualizadoMap.has(cli.id)) return true;
      const atualizadoEmReq = atualizadoMap.get(cli.id);
      if (!atualizadoEmReq) return true;
      return new Date(cli.atualizadoEm).getTime() > new Date(atualizadoEmReq).getTime();
    });

    return clientesParaRetornar;
  }

  async deletar(id: string) {
    return await this.prisma.cliente.update({
      where: { id },
      data: { deletadoEm: new Date() },
    });
  }

  async atualizar(id: string, data: Partial<AtualizarClienteDTO>) {
    return await this.prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async ativar(id: string): Promise<void> {
    await this.prisma.cliente.update({
      data: {
        deletadoEm: null,
      },
      where: {
        id: id,
      },
    });
  }

  // ===================== MÉTODOS DE SINCRONIZAÇÃO E VERSÃO =====================

  async buscarDessincronizadosServidor(lista: { id: string; versao: number }[]): Promise<any[]> {
    const ids = lista.map((item) => item.id);
    const versoesMap = Object.fromEntries(lista.map((item) => [item.id, item.versao]));

    const clientes = await this.prisma.cliente.findMany({
      where: {
        id: { in: ids },
        versao: { not: null },
      },
      select: {
        id: true,
        nome: true,
        documento: true,
        telefone: true,
        nascimento: true,
        atualizadoEm: true,
        deletadoEm: true,
        versao: true,
        endereco: {
          select: {
            id: true,
            rua: true,
            numero: true,
            bairro: true,
            cep: true,
            cidade: {
              select: {
                id: true,
                nome: true,
                estado: {
                  select: {
                    id: true,
                    nome: true,
                    uf: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Retorna apenas clientes com versão maior que a informada
    return clientes.filter((c) => (c.versao ?? 0) > (versoesMap[c.id] ?? 0));
  }

  async buscarDesconhecidos(): Promise<any[]> {
    return this.prisma.cliente.findMany({
      where: { versao: null },
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
    });
  }

  async buscarDessincronizadosLocal(
    versao: boolean = false,
    id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    if (versao) {
      return this.prisma.cliente.findMany({
        where: {
          versao: { not: null },
          ...(id && { id }),
        },
        select: {
          id: true,
          versao: true,
        },
      });
    } else {
      const where: any = { versao: null };
      if (id) where.id = id;

      const clientes = await this.prisma.cliente.findMany({
        where,
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
      });

      return clientes.map((cliente) => ({
        id: cliente.id,
        nome: cliente.nome,
        documento: cliente.documento,
        telefone: cliente.telefone,
        nascimento: cliente.nascimento,
        atualizadoEm: cliente.atualizadoEm,
        deletadoEm: cliente.deletadoEm,
        versao: cliente.versao,
        id_end_fk: cliente.endereco.id,
      }));
    }
  }

  async buscarAtualizacoesLocal(sincronizacao?: Sincronizacao): Promise<any[]> {
    if (!sincronizacao || !sincronizacao.cliente) {
      return [];
    }

    return this.prisma.cliente.findMany({
      where: {
        versao: { not: null },
        atualizadoEm: { gt: sincronizacao.cliente },
      },
      select: {
        id: true,
        nome: true,
        documento: true,
        telefone: true,
        nascimento: true,
        atualizadoEm: true,
        deletadoEm: true,
        versao: true,
        id_end_fk: true,
      },
      orderBy: { atualizadoEm: 'desc' },
    });
  }
}
