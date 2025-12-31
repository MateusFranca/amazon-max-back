import { Injectable, NotFoundException } from '@nestjs/common';
import { CriarProdutoDTO } from './dto/criar-produto.dto';
import { Produto } from '@prisma/client';
import { AtualizarProdutoDTO } from './dto/atualizar-produto.dto';
import { ProdutoRepository } from './produto.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';

@Injectable()
export class ProdutoService {
  constructor(
    private readonly produtoRepository: ProdutoRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async criar(dado: CriarProdutoDTO): Promise<Produto> {
    await this.usuarioRepository.buscarUm(dado.id_usu_fk);
    return this.produtoRepository.criar(dado);
  }

  async buscarUm(id: string): Promise<Produto> {
    return this.existe(id).then(() => this.produtoRepository.buscarUm(id));
  }

  async buscarSemPaginacao(): Promise<Produto[]> {
    return await this.produtoRepository.buscarSemPaginacao();
  }

  async atualizar(id: string, dado: AtualizarProdutoDTO): Promise<Produto> {
    await this.existe(id);
    if (dado.id_usu_fk) {
      await this.usuarioRepository.buscarUm(dado.id_usu_fk);
    }

    return this.produtoRepository.atualizar(id, dado);
  }

  async inativar(id: string, id_usu: string): Promise<void> {
    await this.existe(id).then(() => this.produtoRepository.inativar(id, id_usu));
  }

  async ativar(id: string, dado: AtualizarProdutoDTO): Promise<Produto> {
    return this.existe(id).then(() => this.produtoRepository.ativar(id, dado));
  }

  async buscarTodos(
    pagina: number,
    tamanhoPagina: number,
    textoPesquisa: string,
  ): Promise<{ dado: Produto[]; meta: Paginacao }> {
    const deslocamento = (pagina - 1) * tamanhoPagina;
    const [dado, total] = await Promise.all([
      this.produtoRepository.buscarTodos(deslocamento, tamanhoPagina, textoPesquisa),
      this.produtoRepository.contador(textoPesquisa),
    ]);
    const total_paginas = Math.ceil(total / tamanhoPagina);
    const pagina_atual = pagina;

    if (pagina > total_paginas) {
      throw new NotFoundException('Página não encontrada');
    }

    const meta: Paginacao = {
      total_itens: total,
      itens_por_pagina: tamanhoPagina,
      total_paginas: total_paginas,
      pagina_atual: pagina_atual,
    };

    return { dado, meta };
  }

  async buscarAtivos(
    pagina: number,
    tamanhoPagina: number,
    textoPesquisa: string,
  ): Promise<{ dado: Produto[]; meta: Paginacao }> {
    const deslocamento = (pagina - 1) * tamanhoPagina;
    const [dado, total] = await Promise.all([
      this.produtoRepository.buscarAtivos(deslocamento, tamanhoPagina, textoPesquisa),
      this.produtoRepository.contadorAtivos(textoPesquisa),
    ]);

    const total_paginas = Math.ceil(total / tamanhoPagina);
    const pagina_atual = pagina;

    if (pagina > total_paginas) {
      throw new NotFoundException('Página não encontrada');
    }

    const meta: Paginacao = {
      total_itens: total,
      itens_por_pagina: tamanhoPagina,
      total_paginas: total_paginas,
      pagina_atual: pagina_atual,
    };

    return { dado, meta };
  }

  async buscarAtivo(id: string): Promise<Produto> {
    const produto = await this.produtoRepository.buscarAtivo(id);
    if (!produto) {
      throw new NotFoundException('Produto ativo não encontrado');
    }
    return produto;
  }

  async existe(id: string): Promise<void> {
    const existe = await this.produtoRepository.existe(id);
    if (!existe) {
      throw new NotFoundException(`Registro não encontrado`);
    }
  }

  async anexarImagem(imagens: Express.Multer.File[], id: string) {
    return this.produtoRepository.anexarImagem(imagens, id);
  }

  async remover(id: string): Promise<void> {
    const existe = await this.produtoRepository.existe(id);
    if (!existe) {
      throw new NotFoundException(`Registro não encontrado`);
    }
    return this.produtoRepository.remover(id);
  }
}
