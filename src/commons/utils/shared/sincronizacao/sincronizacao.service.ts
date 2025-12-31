import { Injectable } from '@nestjs/common';
import { SincronizacaoRepository } from './sincronizacao.repository';
import { Sincronizacao } from '@prisma/client';

@Injectable()
export class SincronizacaoService {
  constructor(private readonly sincronizacaoRepository: SincronizacaoRepository) {}

  async criar(
    campo: keyof Sincronizacao,
  ): Promise<Sincronizacao> {
    return this.sincronizacaoRepository.criar(campo);
  }

  async buscarUltimoRegistro(): Promise<Sincronizacao> {
    return this.sincronizacaoRepository.buscarUltimoRegistro();
  }
}
