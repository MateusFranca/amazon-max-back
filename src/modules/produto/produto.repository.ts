import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { Produto, Prisma } from '@prisma/client';
import { CriarProdutoDTO } from './dto/criar-produto.dto';
import { AtualizarProdutoDTO } from './dto/atualizar-produto.dto';
import { enviarArquivoLocal } from 'src/commons/utils/local-file.storage';
import { enviarArquivoOracle } from 'src/commons/utils/bucket-oracle.utils';

@Injectable()
export class ProdutoRepository {
  constructor(private readonly prisma: PrismaService) { }

  async criar(dado: CriarProdutoDTO): Promise<Produto> {
    return this.prisma.produto.create({
      data: {
        marca: dado.marca,
        modelo: dado.modelo,
        valor_completo: dado.valor_completo,
        valor_medio: dado.valor_medio,
        valor_reduzido: dado.valor_reduzido,
        valor_exclusivo: dado.valor_exclusivo,
        foto: dado.foto,
        descricao_tecnica: dado.descricao_tecnica,
        id_usu_fk: dado.id_usu_fk,
      },
    });
  }

  async remover(id: string): Promise<void> {
    await this.prisma.produto.update({
      where: { id },
      data: {
        deletadoEm: new Date(),
      },
    });
  }

  async buscarUm(id: string): Promise<Produto | null> {
    return this.prisma.produto.findUnique({
      where: {
        id: id,
      },
    });
  }

  async buscarSemPaginacao(): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      select: {
        id: true,
        marca: true,
        modelo: true,
        valor_completo: true,
        valor_medio: true,
        valor_reduzido: true,
        valor_exclusivo: true,
        foto: true,
        descricao_tecnica: true,
        versao: true,
        id_usu_fk: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }

  async buscarAtivo(id: string): Promise<Produto | null> {
    return this.prisma.produto.findFirst({
      where: {
        id: id,
        deletadoEm: null,
      },
    });
  }

  async atualizar(id: string, dado: AtualizarProdutoDTO): Promise<Produto> {
    const dadoAtualizado: Prisma.ProdutoUpdateInput = {
      atualizadoEm: new Date(),
    };

    for (const key in dado) {
      if (dado[key] !== undefined) {
        dadoAtualizado[key] = dado[key];
      }
    }

    return this.prisma.produto.update({
      data: dadoAtualizado,
      where: {
        id: id,
      },
    });
  }

  async ativar(id: string, dado: AtualizarProdutoDTO): Promise<Produto> {
    const dadoAtualizado: Prisma.ProdutoUpdateInput = {};

    for (const key in dado) {
      if (dado[key] !== undefined) {
        dadoAtualizado[key] = dado[key];
      }
    }

    dadoAtualizado.deletadoEm = null;
    return this.prisma.produto.update({
      data: dadoAtualizado,
      where: {
        id: id,
      },
    });
  }

  async inativar(id: string, id_usu: string): Promise<void> {
    await this.prisma.produto.update({
      data: {
        deletadoEm: new Date(),
        id_usu_fk: id_usu,
      },
      where: {
        id: id,
        deletadoEm: null,
      },
    });
  }

  async existe(id: string): Promise<boolean> {
    const produto = await this.buscarUm(id);
    return !!produto;
  }

  async anexarImagem(imagens: Express.Multer.File[], id: string) {
    const dadosArquivosEnviados: { nomeImagem: string; urlImagem: string }[] = [];

    try {
      for (const imagem of imagens) {
        const nomeImagem = imagem.originalname;
        const imageBuffer = imagem.buffer;

        if (!nomeImagem || !imageBuffer) {
          throw new Error('Faltando nome ou conteúdo da imagem');
        }

        const file = await enviarArquivoOracle(imageBuffer, nomeImagem, id);
        dadosArquivosEnviados.push({
          nomeImagem: file.nomeArquivo,
          urlImagem: file.linkArquivo,
        });
      }

      const produto = await this.prisma.produto.findUnique({
        where: { id },
        select: { foto: true },
      });
      const existentes = Array.isArray(produto?.foto)
        ? (produto.foto as { nomeImagem: string; urlImagem: string }[])
        : [];
      const todasImagens = [...existentes, ...dadosArquivosEnviados].slice(0, 5);

      await this.prisma.produto.update({
        where: { id },
        data: { foto: todasImagens },
      });

      return { imagem_vei: todasImagens };
    } catch (error) {
      throw new Error('Falha ao criar arquivos para o veículo');
    }
  }

  async buscarTodos(deslocamento: number, tamanhoPagina: number, textoPesquisa: string): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      where: {
        OR: [{ marca: { contains: textoPesquisa } }, { modelo: { contains: textoPesquisa } }],
      },
      select: {
        id: true,
        marca: true,
        modelo: true,
        valor_completo: true,
        valor_medio: true,
        valor_reduzido: true,
        valor_exclusivo: true,
        foto: true,
        descricao_tecnica: true,
        versao: true,
        id_usu_fk: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      skip: deslocamento,
      take: tamanhoPagina,
      orderBy: [{ criadoEm: 'desc' }],
    });
  }

  async contador(textoPesquisa: string): Promise<number> {
    return this.prisma.produto.count({
      where: {
        OR: [{ marca: { contains: textoPesquisa } }, { modelo: { contains: textoPesquisa } }],
      },
    });
  }

  async buscarAtivos(deslocamento: number, tamanhoPagina: number, textoPesquisa: string): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      where: {
        OR: [{ marca: { contains: textoPesquisa } }, { modelo: { contains: textoPesquisa } }],
      },
      select: {
        id: true,
        marca: true,
        modelo: true,
        valor_completo: true,
        valor_medio: true,
        valor_reduzido: true,
        valor_exclusivo: true,
        foto: true,
        descricao_tecnica: true,
        versao: true,
        id_usu_fk: true,
        criadoEm: true,
        atualizadoEm: true,
        deletadoEm: true,
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      skip: deslocamento,
      take: tamanhoPagina,
      orderBy: [{ criadoEm: 'desc' }],
    });
  }

  async contadorAtivos(textoPesquisa: string): Promise<number> {
    return this.prisma.produto.count({
      where: {
        OR: [{ marca: { contains: textoPesquisa } }, { modelo: { contains: textoPesquisa } }],
        deletadoEm: null,
      },
    });
  }
}
