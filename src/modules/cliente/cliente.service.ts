import { Injectable, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from './cliente.repository';
import { CriarClienteDTO } from './dto/criar-cliente.dto';
import { AtualizarClienteDTO } from './dto/atualizar-cliente.dto';
import { Cliente } from '@prisma/client';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { VersionamentoService } from 'src/commons/utils/shared/versionamento/versionamento.service';
import { DateTime } from 'luxon';

@Injectable()
export class ClienteService {
  constructor(
    private readonly clienteRepository: ClienteRepository,
    private readonly sincronizacaoService: SincronizacaoService,
    private readonly versionamentoService: VersionamentoService,
  ) {}

  async criar(dado: CriarClienteDTO) {
    const dadoVersionado = await this.versionamentoService.aplicarVersaoAoCriar(dado);
    return this.clienteRepository.criar(dadoVersionado);
  }

  async buscarTodos(
    pagina: number,
    tamanhoPagina: number,
    textoBusca: string,
  ): Promise<{ dado: Cliente[]; meta: Paginacao }> {
    const deslocamento = (pagina - 1) * tamanhoPagina;
    const [dado, total] = await Promise.all([
      this.clienteRepository.buscarTodos(deslocamento, tamanhoPagina, textoBusca),
      this.clienteRepository.contador(textoBusca),
    ]);
    const total_paginas = Math.ceil(total / tamanhoPagina);
    const pagina_atual = pagina;

    if (pagina > total_paginas && total_paginas > 0) {
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

  async listarPorNome(ids?: string[], atualizadosArray?: string[]) {
    if (ids && ids.length > 0) {
      return this.clienteRepository.listarPorNomePorIds(ids, atualizadosArray);
    }
    return this.clienteRepository.listarPorNome();
  }

  async buscarUm(id: string) {
    const cliente = await this.clienteRepository.buscarUm(id);
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  async atualizarCliente(id: string, dado: Partial<Cliente>) {
    await this.buscarUm(id);
    dado.atualizadoEm = DateTime.now().setZone('America/Porto_Velho').toJSDate();

    const dadoVersionado = await this.versionamentoService.aplicarVersaoAoAtualizar('cliente', id, dado);
    return this.clienteRepository.atualizar(id, dadoVersionado);
  }

  async removerCliente(id: string) {
    await this.buscarUm(id);
    return this.clienteRepository.deletar(id);
  }

  async ativar(id: string): Promise<void> {
    await this.clienteRepository.ativar(id);
  }

  // ===================== MÉTODOS DE SINCRONIZAÇÃO =====================

  async buscarDessincronizadosServidor(lista: { id: string; versao: number }[]): Promise<Cliente[]> {
    return this.clienteRepository.buscarDessincronizadosServidor(lista);
  }

  async buscarDesconhecidos(): Promise<Cliente[]> {
    return this.clienteRepository.buscarDesconhecidos();
  }

  async buscarDessincronizadosLocal(
    versao: boolean = false,
    id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    return this.clienteRepository.buscarDessincronizadosLocal(versao, id);
  }

  async buscarAtualizacoesLocal(): Promise<Cliente[]> {
    const sincronizacao = await this.sincronizacaoService.buscarUltimoRegistro();
    return this.clienteRepository.buscarAtualizacoesLocal(sincronizacao);
  }
}
