import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoRepository } from './estado.repository';
import { Estado } from '@prisma/client';

@Injectable()
export class EstadoService {
  constructor(private readonly estadoRepository: EstadoRepository) { }

  async buscarTodos(): Promise<Estado[]> {
    return this.estadoRepository.buscarTodos();
  }

  async buscarUm(id: string): Promise<Estado | null> {
    const state = await this.estadoRepository.buscarUm(id);
    return state;
  }
}
