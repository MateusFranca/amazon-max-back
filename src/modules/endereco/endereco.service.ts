import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CriarEnderecoDTO } from './dto/criar-endereco.dto';
import { Endereco } from '@prisma/client';
import { EnderecoRepository } from './endereco.repository';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { VersionamentoService } from 'src/commons/utils/shared/versionamento/versionamento.service';
import { DateTime } from 'luxon';

@Injectable()
export class EnderecoService {
  constructor(
    private readonly enderecoRepository: EnderecoRepository,
    private readonly sincronizacaoService: SincronizacaoService,
    private readonly versionamentoService: VersionamentoService,
  ) {}

  async criar(dado: CriarEnderecoDTO): Promise<Endereco> {
    const dadoVersionado = await this.versionamentoService.aplicarVersaoAoCriar(dado);
    return this.enderecoRepository.criar(dadoVersionado);
  }

  async buscarTodos(
    page: number,
    tamanhoPagina: number,
    textoBusca: string,
  ): Promise<{ dado: Endereco[]; meta: Paginacao }> {
    const deslocamento = (page - 1) * tamanhoPagina;
    const [dado, total] = await Promise.all([
      this.enderecoRepository.buscarTodos(deslocamento, tamanhoPagina, textoBusca),
      this.enderecoRepository.contarTodos(textoBusca),
    ]);

    const total_paginas = Math.ceil(total / tamanhoPagina);
    const pagina_atual = page;

    if (page > total_paginas) {
      throw new NotFoundException('Página não encontrada');
    }

    const meta: Paginacao = {
      total_itens: total,
      itens_por_pagina: tamanhoPagina,
      total_paginas,
      pagina_atual,
    };

    return { dado, meta };
  }

  async buscarUm(id: string): Promise<Endereco> {
    return this.enderecoRepository.buscarUm(id);
  }

  async atualizar(id: string, dados: any): Promise<Endereco> {
    dados.atualizadoEm = DateTime.now().setZone('America/Porto_Velho').toJSDate();
    const dadoVersionado = await this.versionamentoService.aplicarVersaoAoAtualizar('endereco', id, dados);
    return this.enderecoRepository.atualizar(id, dadoVersionado);
  }

  async deletar(id: string): Promise<void> {
    await this.enderecoRepository.deletar(id);
  }

  async buscarDessincronizadosServidor(lista: { id: string; versao: number }[]): Promise<Endereco[]> {
    return this.enderecoRepository.buscarDessincronizadosServidor(lista);
  }

  async buscarDesconhecidos(): Promise<Endereco[]> {
    return this.enderecoRepository.buscarDesconhecidos();
  }

  async buscarDessincronizadosLocal(
    versao: boolean = false,
    id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    return this.enderecoRepository.buscarDessincronizadosLocal(versao, id);
  }

  async buscarAtualizacoesLocal(): Promise<Endereco[]> {
    const sincronizacao = await this.sincronizacaoService.buscarUltimoRegistro();
    return this.enderecoRepository.buscarAtualizacoesLocal(sincronizacao);
  }
}
