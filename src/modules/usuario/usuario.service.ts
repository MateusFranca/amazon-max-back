import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { CriarUsuarioDTO } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDTO } from './dto/atualizar-usuario.dto';
import { Usuario } from '@prisma/client';
import { SincronizacaoVersaoDto } from '../orcamento/dto/sincronizacao-versao.dto';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly sincronizacaoService: SincronizacaoService,
  ) {}

  async existeUsuario(email_adm: string): Promise<boolean> {
    return await this.usuarioRepository.existeEmail(email_adm);
  }

  async criar(dado: CriarUsuarioDTO): Promise<Usuario> {
    return this.usuarioRepository.criar(dado);
  }

  async buscarTodos(
    pagina: number,
    tamanhoPagina: number,
    textoBusca: string,
  ): Promise<{ dado: Pick<Usuario, 'id' | 'nome' | 'email' | 'cargo' | 'acessos'>[]; meta: Paginacao }> {
    const deslocamento = (pagina - 1) * tamanhoPagina;
    const [dado, total] = await Promise.all([
      this.usuarioRepository.buscarTodos(deslocamento, tamanhoPagina, textoBusca),
      this.usuarioRepository.contador(textoBusca),
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

  async buscarTodosNomes(): Promise<Pick<Usuario, 'id' | 'nome'>[] | null> {
    return this.usuarioRepository.buscarTodosNomes();
  }

  async buscarTodosOffline(): Promise<Pick<Usuario, 'nome' | 'email' | 'cargo'>[] | null> {
    return this.usuarioRepository.buscarTodosOffline();
  }

  async buscarUm(id: string): Promise<Pick<Usuario, 'nome' | 'email' | 'cargo'> | null> {
    return this.existe(id).then(() => this.usuarioRepository.buscarUm(id));
  }

  async atualizar(id: string, dado: AtualizarUsuarioDTO): Promise<Usuario> {
    return this.existe(id).then(() => this.usuarioRepository.atualizar(id, dado));
  }

  async deletar(id: string): Promise<void> {
    await this.existe(id).then(() => this.usuarioRepository.deletar(id));
  }

  async ativar(id: string): Promise<void> {
    await this.usuarioRepository.ativar(id);
  }

  private async existe(id: string): Promise<void> {
    const existe = await this.usuarioRepository.buscarUm(id);
    if (!existe) {
      throw new NotFoundException(`Registro não encontrado`);
    }
  }

  async encontrarPorEmail(email: string) {
    return this.usuarioRepository.encontrarPorEmail(email);
  }

  async buscarPorEmail(email: string) {
    return await this.usuarioRepository.buscarPorEmail(email);
  }

  async buscarPorId(id_usu: string) {
    return this.usuarioRepository.buscarPorId(id_usu);
  }

  async buscarDessincronizadosLocal(
    versao: boolean = false,
    id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    return this.usuarioRepository.buscarDessincronizadosLocal(versao, id);
  }

  async buscarDessincronizadosServidor(lista: SincronizacaoVersaoDto[]): Promise<Usuario[]> {
    return this.usuarioRepository.buscarDessincronizadosServidor(lista);
  }

  async buscarDesconhecidos(): Promise<Usuario[]> {
    return this.usuarioRepository.buscarDesconhecidos();
  }

  async buscarAtualizacoesLocal(): Promise<Usuario[]> {
    const sincronizacao = await this.sincronizacaoService.buscarUltimoRegistro();
    return this.usuarioRepository.buscarAtualizacoesLocal(sincronizacao);
  }
}
