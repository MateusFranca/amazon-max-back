import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { Usuario, Prisma, Sincronizacao } from '@prisma/client';
import { CriarUsuarioDTO } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDTO } from './dto/atualizar-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dado: CriarUsuarioDTO): Promise<Usuario> {
    const hashSenha = await bcrypt.hash(dado.senha, 16);

    return this.prisma.usuario.create({
      data: {
        nome: dado.nome,
        cargo: dado.cargo,
        email: dado.email,
        senha: hashSenha,
        percentual_comissao: dado.percentual_comissao,
      },
    });
  }

  async buscarTodos(
    pagina: number,
    tamanhoPagina: number,
    textoBusca: string,
  ): Promise<Pick<Usuario, 'id' | 'nome' | 'email' | 'cargo' | 'acessos'>[]> {
    return this.prisma.usuario.findMany({
      where: {
        OR: [{ nome: { contains: textoBusca } }],
      },
      skip: pagina,
      take: tamanhoPagina,
      orderBy: {
        criadoEm: 'desc',
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        acessos: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
      },
    });
  }

  async buscarTodosNomes(): Promise<Pick<Usuario, 'id' | 'nome'>[]> {
    return this.prisma.usuario.findMany({
      where: {
        deletadoEm: null,
      },
      select: {
        id: true,
        nome: true,
      },
    });
  }

  async buscarTodosOffline(): Promise<Pick<Usuario, 'nome' | 'email' | 'cargo'>[]> {
    return this.prisma.usuario.findMany({
      where: {
        deletadoEm: null,
      },
      select: {
        nome: true,
        email: true,
        cargo: true,
      },
    });
  }

  async buscarUm(id: string): Promise<Pick<Usuario, 'nome' | 'email' | 'cargo'> | null> {
    return this.prisma.usuario.findUnique({
      where: {
        id: id,
        deletadoEm: null,
      },
      select: {
        nome: true,
        email: true,
        cargo: true,
        percentual_comissao: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
      },
    });
  }

  async buscarPorEmail(email: string): Promise<Pick<Usuario, 'nome' | 'email' | 'cargo'> | null> {
    return this.prisma.usuario.findFirst({
      where: {
        email: email,
        deletadoEm: null,
      },
      select: {
        nome: true,
        email: true,
        cargo: true,
      },
    });
  }

  async atualizar(id: string, dado: AtualizarUsuarioDTO): Promise<Usuario> {
    const atualizarDados: Prisma.UsuarioUpdateInput = {};

    for (const chave in dado) {
      if (dado[chave] !== undefined) {
        if (chave === 'senha') {
          atualizarDados[chave] = await bcrypt.hash(dado[chave], 10);
        } else {
          atualizarDados[chave] = dado[chave];
        }
      }
    }

    return this.prisma.usuario.update({
      data: atualizarDados,
      where: {
        id: id,
        deletadoEm: null,
      },
    });
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.usuario.update({
      data: {
        deletadoEm: new Date(),
      },
      where: {
        id: id,
        deletadoEm: null,
      },
    });
  }

  async ativar(id: string): Promise<void> {
    await this.prisma.usuario.update({
      data: {
        deletadoEm: null,
      },
      where: {
        id: id,
      },
    });
  }

  async existeEmail(email: string): Promise<boolean> {
    const existe = await this.prisma.usuario.findFirst({
      where: {
        email: email,
        deletadoEm: null,
      },
    });

    return !!existe;
  }

  async existe(id: string): Promise<boolean> {
    const usuario = await this.buscarUm(id);
    return !!usuario;
  }

  async contador(buscarTexto: string): Promise<number> {
    return this.prisma.usuario.count({
      where: {
        deletadoEm: null,
        OR: [{ nome: { contains: buscarTexto } }],
      },
    });
  }

  async encontrarPorEmail(email: string) {
    return this.prisma.usuario.findFirst({
      where: { email: email },
    });
  }

  async buscarPorId(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }

    return usuario;
  }

  async buscarDessincronizadosLocal(
    versao: boolean = false,
    id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    if (versao) {
      return this.prisma.usuario.findMany({
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

      const usuarios = await this.prisma.usuario.findMany({
        where,
      });

      return usuarios.map((usuario) => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
        criadoEm: usuario.criadoEm,
        atualizadoEm: usuario.atualizadoEm,
        deletadoEm: usuario.deletadoEm,
        versao: usuario.versao,
      }));
    }
  }

  async buscarDessincronizadosServidor(lista: { id: string; versao: number }[]): Promise<any[]> {
    const ids = lista.map((item) => item.id);
    const versoesMap = Object.fromEntries(lista.map((item) => [item.id, item.versao]));

    const usuarios = await this.prisma.usuario.findMany({
      where: {
        id: { in: ids },
        versao: { not: null },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
        versao: true,
      },
    });

    // Retorna apenas usuários com versão maior que a informada
    return usuarios.filter((u) => (u.versao ?? 0) > (versoesMap[u.id] ?? 0));
  }

  async buscarDesconhecidos(): Promise<any[]> {
    return this.prisma.usuario.findMany({
      where: { versao: null },
    });
  }

  async buscarAtualizacoesLocal(sincronizacao?: Sincronizacao): Promise<any[]> {
    if (!sincronizacao || !sincronizacao.usuario) {
      return [];
    }

    return this.prisma.usuario.findMany({
      where: {
        versao: { not: null },
        atualizadoEm: { gt: sincronizacao.usuario },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
        versao: true,
      },
      orderBy: { atualizadoEm: 'desc' },
    });
  }
}
