import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { CriarEnderecoDTO } from './dto/criar-endereco.dto';
import { AtualizarEnderecoDTO } from './dto/atualizar-endereco.dto';
import { Endereco, Prisma, Sincronizacao } from '@prisma/client';

@Injectable()
export class EnderecoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: CriarEnderecoDTO): Promise<Endereco> {
    return this.prisma.endereco.create({
      data: {
        id: data.id,
        rua: data.rua,
        bairro: data.bairro,
        cep: data.cep,
        numero: data.numero,
        complemento: data.complemento,
        versao: data.versao,
        id_cid_fk: data.id_cid_fk,
      },
    });
  }

  async buscarTodos(deslocamento: number, tamanhoPagina: number, buscarTexto: string): Promise<Endereco[]> {
    return this.prisma.endereco.findMany({
      where: {
        deletadoEm: null,
        OR: [{ rua: { contains: buscarTexto } }],
      },
      include: {
        cidade: {
          include: {
            estado: true,
          },
        },
      },
      skip: deslocamento,
      take: tamanhoPagina,
    });
  }

  async buscarUm(id: string): Promise<Endereco> {
    const endereco = await this.prisma.endereco.findUnique({
      where: {
        id: id,
        deletadoEm: null,
      },
    });

    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    return endereco;
  }

  async atualizar(id: string, dado: AtualizarEnderecoDTO): Promise<Endereco> {
    const existe = await this.existe(id);

    if (!existe) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    const atualizarDado: Prisma.EnderecoUpdateInput = {};

    for (const chave in dado) {
      if (dado[chave] !== undefined) {
        atualizarDado[chave] = dado[chave];
      }
    }

    return this.prisma.endereco.update({
      data: atualizarDado,
      where: {
        id: id,
        deletadoEm: null,
      },
    });
  }

  async deletar(id: string): Promise<void> {
    const existe = await this.existe(id);

    if (!existe) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    await this.prisma.endereco.update({
      data: {
        deletadoEm: new Date(),
      },
      where: {
        id: id,
        deletadoEm: null,
      },
    });
  }

  async existe(id: string): Promise<boolean> {
    const endereco = await this.prisma.endereco.findUnique({
      where: {
        id: id,
        deletadoEm: null,
      },
    });

    return !!endereco;
  }

  async contarTodos(buscarTexto: string): Promise<number> {
    return this.prisma.endereco.count({
      where: {
        deletadoEm: null,
        OR: [{ rua: { contains: buscarTexto } }],
      },
    });
  }

  // ===================== MÉTODOS DE SINCRONIZAÇÃO E VERSÃO =====================

  async buscarDessincronizadosServidor(lista: { id: string; versao: number }[]): Promise<any[]> {
    const ids = lista.map((item) => item.id);
    const versoesMap = Object.fromEntries(lista.map((item) => [item.id, item.versao]));

    const enderecos = await this.prisma.endereco.findMany({
      where: {
        id: { in: ids },
        versao: { not: null },
      },
      select: {
        id: true,
        rua: true,
        bairro: true,
        cep: true,
        numero: true,
        complemento: true,
        id_cid_fk: true,
        atualizadoEm: true,
        deletadoEm: true,
        versao: true,
      },
    });

    return enderecos.filter((e) => (e.versao ?? 0) > (versoesMap[e.id] ?? 0));
  }

  async buscarDesconhecidos(): Promise<any[]> {
    return this.prisma.endereco.findMany({
      where: { versao: null },
      include: {
        cidade: {
          include: {
            estado: true,
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
      return this.prisma.endereco.findMany({
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

      const enderecos = await this.prisma.endereco.findMany({
        where,
        include: {
          cidade: {
            include: {
              estado: true,
            },
          },
        },
      });

      return enderecos.map((endereco) => ({
        id: endereco.id,
        rua: endereco.rua,
        bairro: endereco.bairro,
        cep: endereco.cep,
        numero: endereco.numero,
        complemento: endereco.complemento,
        id_cid_fk: endereco.id_cid_fk,
        criadoEm: endereco.criadoEm,
        atualizadoEm: endereco.atualizadoEm,
        deletadoEm: endereco.deletadoEm,
        versao: endereco.versao,
      }));
    }
  }

  async buscarAtualizacoesLocal(sincronizacao?: Sincronizacao): Promise<any[]> {
    if (!sincronizacao || !sincronizacao.endereco) {
      return [];
    }

    return this.prisma.endereco.findMany({
      where: {
        versao: { not: null },
        atualizadoEm: { gt: sincronizacao.endereco },
      },
      select: {
        id: true,
        rua: true,
        bairro: true,
        cep: true,
        numero: true,
        complemento: true,
        id_cid_fk: true,
        atualizadoEm: true,
        deletadoEm: true,
        versao: true,
      },
      orderBy: { atualizadoEm: 'desc' },
    });
  }
}
