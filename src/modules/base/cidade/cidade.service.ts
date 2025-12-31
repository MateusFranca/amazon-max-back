import { Injectable, NotFoundException } from '@nestjs/common';
import { CidadeRepository } from './cidade.repository';
import { Cidade } from '@prisma/client';

@Injectable()
export class CidadeService {
  constructor(private readonly cidadeRepository: CidadeRepository) { }

  async buscarTodos(): Promise<Cidade[]> {
    return this.cidadeRepository.buscarTodos();
  }

  async buscarUm(id: string): Promise<Cidade> {
    return await this.cidadeRepository.buscarUm(id);
  }

  async buscarCidadePorEstado(id: string): Promise<Cidade[]> {
    return await this.cidadeRepository.buscarCidadePorEstado(id);
  }
}
