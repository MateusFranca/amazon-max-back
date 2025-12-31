import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ClienteRepository } from 'src/modules/cliente/cliente.repository';
import { EnderecoRepository } from 'src/modules/endereco/endereco.repository';
import { OrcamentoRepository } from 'src/modules/orcamento/orcamento.repository';

@Injectable()
export class VersionamentoService {
  constructor(
    @Inject(forwardRef(() => OrcamentoRepository))
    private readonly orcamentoRepository: OrcamentoRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly enderecoRepository: EnderecoRepository,
  ) {}

  private readonly repositorios: Record<string, { buscarUm: (id: string) => Promise<{ versao?: number } | null> }> = {
    orcamento: this.orcamentoRepository,
    cliente: this.clienteRepository,
    endereco: this.enderecoRepository,
  };

  async aplicarVersaoAoCriar<T>(dados: T): Promise<T | (T & { versao: number })> {
    if (process.env.ENVIRONMENT !== 'servidor') {
      return dados;
    }

    return { ...dados, versao: 1 };
  }

  async aplicarVersaoAoAtualizar<T>(
    nomeRepositorio: string,
    id: string,
    dados: T,
  ): Promise<T | (T & { versao: number })> {
    if (process.env.ENVIRONMENT !== 'servidor') {
      return dados;
    }

    const repositorio = this.repositorios[nomeRepositorio];
    if (!repositorio) {
      throw new Error(`Repositório "${nomeRepositorio}" não encontrado no versionamento`);
    }

    const registro = await repositorio.buscarUm(id);
    const versaoAtual = registro?.versao ?? 0;

    return { ...dados, versao: versaoAtual + 1 };
  }
}
