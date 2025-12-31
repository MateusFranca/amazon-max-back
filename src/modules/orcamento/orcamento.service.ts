import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { Orcamento } from '@prisma/client';
import { OrcamentoRepository } from './orcamento.repository';
import { ProdutoOrcamentoRepository } from './produto-orcamento.repository';
import { VersionamentoService } from 'src/commons/utils/shared/versionamento/versionamento.service';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { DateTime } from 'luxon';

@Injectable()
export class OrcamentoService {
  constructor(
    private readonly orcamentoRepository: OrcamentoRepository,
    private readonly produtoOrcamentoRepository: ProdutoOrcamentoRepository,
    private readonly versionamentoService: VersionamentoService,
    private readonly sincronizacaoService: SincronizacaoService,
  ) {}

  async criar(dados: any): Promise<Orcamento> {
    const agora = DateTime.now().setZone('America/Porto_Velho').toJSDate();
    dados.criadoEm = agora;
    dados.atualizadoEm = agora;
    const dadoVersionado = await this.versionamentoService.aplicarVersaoAoCriar(dados);
    return this.orcamentoRepository.criar(dadoVersionado);
  }

  async buscarTodos(
    pagina: number,
    tamanhoPagina: number,
    textoBusca: string,
    usuarioId: string = '',
    cargo: string = '',
  ): Promise<{ dado: Orcamento[]; meta: any }> {
    const deslocamento = (pagina - 1) * tamanhoPagina;

    const filtrarPorUsuario = cargo === 'vendedor' && usuarioId ? true : false;

    const [dado, total] = await Promise.all([
      this.orcamentoRepository.buscarTodos(
        deslocamento,
        tamanhoPagina,
        textoBusca,
        filtrarPorUsuario ? usuarioId : undefined,
      ),
      this.orcamentoRepository.contador(textoBusca, filtrarPorUsuario ? usuarioId : undefined),
    ]);
    const total_paginas = Math.ceil(total / tamanhoPagina);
    const pagina_atual = pagina;

    if (pagina > total_paginas && total_paginas > 0) {
      throw new NotFoundException('Página não encontrada');
    }

    const meta = {
      total_itens: total,
      itens_por_pagina: tamanhoPagina,
      total_paginas: total_paginas,
      pagina_atual: pagina_atual,
    };

    return { dado, meta };
  }

  async buscarUm(id: string): Promise<Orcamento> {
    await this.existeOrcamentoEProdutoOrcamento(id);
    return this.orcamentoRepository.buscarUm(id);
  }

  async atualizar(id: string, dados: any): Promise<Orcamento> {
    await this.existeOrcamentoEProdutoOrcamento(id);
    dados.atualizadoEm = DateTime.now().setZone('America/Porto_Velho').toJSDate();
    const dadoVersionado = await this.versionamentoService.aplicarVersaoAoAtualizar('orcamento', id, dados);

    return this.orcamentoRepository.atualizar(id, dadoVersionado);
  }

  async ativar(id: string): Promise<void> {
    await this.orcamentoRepository.ativar(id);
  }

  async remover(id: string): Promise<void> {
    await this.existeOrcamentoEProdutoOrcamento(id);
    return this.orcamentoRepository.remover(id);
  }

  async adicionarProduto(dados: any): Promise<any> {
    if (!dados.id_pro_fk) {
      throw new Error('Produto é obrigatório');
    }

    const dadosFormatados = {
      valor_unitario: dados.valor_unitario,
      valor_final_unitario: dados.valor_final_unitario,
      quantidade: dados.quantidade,
      orcamento: dados.orcamento,
      produto: {
        connect: { id: dados.id_pro_fk },
      },
    };

    return this.produtoOrcamentoRepository.criar(dadosFormatados);
  }

  async atualizarProduto(id: string, dados: any): Promise<any> {
    await this.produtoOrcamentoRepository.existe(id);
    return this.produtoOrcamentoRepository.atualizar(id, dados);
  }

  async removerProduto(id: string): Promise<void> {
    await this.produtoOrcamentoRepository.existe(id);
    return this.produtoOrcamentoRepository.remover(id);
  }

  async buscarAtivos(
    pagina: number,
    tamanhoPagina: number,
    textoBusca: string,
  ): Promise<{ dado: Orcamento[]; meta: any }> {
    const deslocamento = (pagina - 1) * tamanhoPagina;
    const [dado, total] = await Promise.all([
      this.orcamentoRepository.buscarAtivos(deslocamento, tamanhoPagina, textoBusca),
      this.orcamentoRepository.contadorAtivo(textoBusca),
    ]);
    const total_paginas = Math.ceil(total / tamanhoPagina);
    const pagina_atual = pagina;

    if (pagina > total_paginas) {
      throw new NotFoundException('Página não encontrada');
    }

    const meta = {
      total_itens: total,
      itens_por_pagina: tamanhoPagina,
      total_paginas: total_paginas,
      pagina_atual: pagina_atual,
    };

    return { dado, meta };
  }

  async existeOrcamentoEProdutoOrcamento(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("The 'id' parameter must not be null or undefined. Please provide a valid 'id'.");
    }

    return this.produtoOrcamentoRepository.existe(id);
  }

  // Sincronização de versão

  async buscarDessincronizadosServidor(lista: { id: string; versao: number }[]): Promise<Orcamento[]> {
    return this.orcamentoRepository.buscarDessincronizadosServidor(lista);
  }

  async buscarDesconhecidos(): Promise<Orcamento[]> {
    return this.orcamentoRepository.buscarDesconhecidos();
  }

  async exportarRelatorio(usuarioId: string, dataInicial: string, dataFinal: string) {
    return this.orcamentoRepository.buscarParaRelatorio(usuarioId, dataInicial, dataFinal);
  }

  async buscarDessincronizadosLocal(
    versao: boolean = false,
    id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    return this.orcamentoRepository.buscarDessincronizadosLocal(versao, id);
  }

  async buscarAtualizacoesLocal(): Promise<Orcamento[]> {
    const sincronizacao = await this.sincronizacaoService.buscarUltimoRegistro();

    return this.orcamentoRepository.buscarAtualizacoesLocal(sincronizacao);
  }
}
