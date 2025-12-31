import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CriarEnderecoDTO } from './dto/criar-endereco.dto';
import { EnderecoService } from './endereco.service';
import { AtualizarEnderecoDTO } from './dto/atualizar-endereco.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { RoleGuard } from 'src/commons/guards/role.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { SincronizacaoVersaoDto } from '../orcamento/dto/sincronizacao-versao.dto';
import { Endereco } from '@prisma/client';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';

@Controller('amazon/enderecos')
@ApiTags('Enderecos')
@UseGuards(AuthGuard, RoleGuard)
@Roles('admin', 'vendedor')
export class EnderecoController {
  constructor(
    private readonly enderecoService: EnderecoService,
    private readonly sincronizacaoService: SincronizacaoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um endereço' })
  async criar(@Body(new ValidationPipe()) dado: CriarEnderecoDTO) {
    return this.enderecoService.criar(dado);
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todos os endereços' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'limitePorPagina', required: false })
  @ApiQuery({ name: 'buscarTexto', required: false })
  async buscarTodos(
    @Query('pagina') pagina: string = '1',
    @Query('limitePorPagina') tamanhoPagina: string = '1',
    @Query('buscarTexto') buscarTexto: string = '',
  ) {
    const total_paginas = parseInt(pagina, 10);
    const pagina_atual = parseInt(tamanhoPagina, 10);
    return this.enderecoService.buscarTodos(total_paginas, pagina_atual, buscarTexto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um endereço por ID' })
  async buscarUm(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException({
            message: 'ID não fornecido ou inválido.',
            error: 'Bad Request',
            statusCode: 400,
          }),
      }),
    )
    id: string,
  ) {
    return this.enderecoService.buscarUm(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um endereço por ID' })
  async atualizar(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException({
            message: 'ID não fornecido ou inválido.',
            error: 'Bad Request',
            statusCode: 400,
          }),
      }),
    )
    id: string,
    @Body(new ValidationPipe({ transform: true })) dado: AtualizarEnderecoDTO,
  ) {
    return this.enderecoService.atualizar(id, dado);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um endereço por ID' })
  async deletar(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException({
            message: 'ID não fornecido ou inválido.',
            error: 'Bad Request',
            statusCode: 400,
          }),
      }),
    )
    id: string,
    @Res() res: Response,
  ) {
    await this.enderecoService.deletar(id);
    return res.status(204).send();
  }

  @Get('sincronizar/buscar-dessincronizados/local')
  async buscarDessincronizadosLocal(
    @Query('versao') versao: boolean = false,
    @Query('id') id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    return this.enderecoService.buscarDessincronizadosLocal(versao, id);
  }

  /**
   * Recebe um array de {id, versao} e retorna os enderecos que precisam ser atualizados localmente
   */
  @Post('sincronizar/dessincronizados/servidor')
  async buscarDessincronizadosServidor(@Body() dados: SincronizacaoVersaoDto[]): Promise<Endereco[]> {
    return this.enderecoService.buscarDessincronizadosServidor(dados);
  }

  /**
   * Recebe enderecos para criar ou atualizar no servidor
   */
  @Post('sincronizar/local')
  async sincronizarLocal(
    @Body() enderecos: CriarEnderecoDTO[],
    @Query('modo') modo: 'criar' | 'atualizar' = 'criar',
  ): Promise<any[]> {
    const resultados = [];
    for (const endereco of enderecos) {
      if (modo === 'atualizar') {
        const atualizado = await this.enderecoService.atualizar(endereco.id, endereco);
        resultados.push(atualizado);
      } else {
        const criado = await this.enderecoService.criar(endereco);
        resultados.push(criado);
      }
    }
    return resultados;
  }

  /**
   * Retorna todos os enderecos que não foram cadastrados no servidor (sem versão definida)
   */
  @Get('sincronizar/buscar-desconhecidos')
  async buscarDesconhecidos(): Promise<Endereco[]> {
    return this.enderecoService.buscarDesconhecidos();
  }

  /**
   * Retorna todos os enderecos que foram atualizados localmente e precisam ser sincronizados
   */
  @Get('sincronizar/atualizacoes/local')
  async buscarAtualizacoesLocal(): Promise<Endereco[]> {
    return this.enderecoService.buscarAtualizacoesLocal();
  }
}
