import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { Cidade } from '@prisma/client';
import { EstadoRepository } from '../estado/estado.repository';

@Injectable()
export class CidadeRepository {
  constructor(private readonly prisma: PrismaService,
    private readonly estadoRepository: EstadoRepository
  ) { }

  async buscarTodos(): Promise<Cidade[]> {
    return this.prisma.cidade.findMany({
      where: { deletadoEm: null },
      orderBy: { nome: 'asc' },
      include: { estado: true },
    });
  }

  async buscarUm(id: string): Promise<Cidade> {
    const cidade = await this.prisma.cidade.findUnique({
      where: {
        id: id,
        deletadoEm: null,
      },
    });

    if (!cidade) {
      throw new NotFoundException(`Cidade não encontrada`);
    }

    return cidade;
  }

  async buscarCidadePorEstado(id: string): Promise<Cidade[]> {    
    const ExisteCidadePorEstado = await this.estadoRepository.existe(id)

    if (!ExisteCidadePorEstado) {
      throw new NotFoundException(`Estado não encontrado`);
    }

    return this.prisma.cidade.findMany({
      where: {
        estado: {
          id: id,
        },
        deletadoEm: null,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async existe(id: string): Promise<boolean> {
    const cidade = await this.prisma.cidade.findUnique({
      where: {
        id: id,
        deletadoEm: null
      }
    });

    return !!cidade;
  }
}
