import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { Estado } from '@prisma/client';

@Injectable()
export class EstadoRepository {
  constructor(private readonly prisma: PrismaService) { }

  async buscarTodos(): Promise<Estado[]> {
    return this.prisma.estado.findMany({
      where: { deletadoEm: null },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarUm(id: string): Promise<Estado> {
    const city = await this.prisma.estado.findUnique({
      where: {
        id: id,
        deletadoEm: null,
      },
    });

    if (!city) {
      throw new NotFoundException(`Estado não encontrado`);
    }

    return city
  }

  async existe(id: string): Promise<boolean> {
    const estado = await this.prisma.estado.findUnique({
      where: {
        id: id,
        deletadoEm: null
      },
    });

    return !!estado;
  }
}
