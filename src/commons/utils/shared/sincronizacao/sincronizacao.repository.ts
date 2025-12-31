import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { Sincronizacao } from '@prisma/client';
import { DateTime } from 'luxon';

@Injectable()
export class SincronizacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(campo: keyof Sincronizacao): Promise<Sincronizacao> {
    const ultimo = await this.buscarUltimoRegistro();

    const agoraPortoVelho = DateTime.now().setZone('America/Porto_Velho').toJSDate();

    const novoRegistro = {
      usuario: ultimo?.usuario ?? agoraPortoVelho,
      produto: ultimo?.produto ?? agoraPortoVelho,
      cliente: ultimo?.cliente ?? agoraPortoVelho,
      endereco: ultimo?.endereco ?? agoraPortoVelho,
      orcamento: ultimo?.orcamento ?? agoraPortoVelho,
      produtoOrcamento: ultimo?.produtoOrcamento ?? agoraPortoVelho,
      [campo]: agoraPortoVelho,
    };

    if (campo === 'orcamento') {
      novoRegistro.produtoOrcamento = agoraPortoVelho;
    }

    if (campo === 'cliente') {
      novoRegistro.endereco = agoraPortoVelho;
    }

    return this.prisma.sincronizacao.create({
      data: novoRegistro,
    });
  }

  async buscarUltimoRegistro(): Promise<Sincronizacao> {
    return this.prisma.sincronizacao.findFirst({
      orderBy: { criadoEm: 'desc' },
    });
  }
}
