import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
  Res,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { OrcamentoService } from './orcamento.service';
import { RoleGuard } from 'src/commons/guards/role.guard';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { SincronizacaoVersaoDto } from './dto/sincronizacao-versao.dto';
import { Orcamento } from '@prisma/client';
import { CriarOrcamentoDto } from './dto/criar-orcamento.dto';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';

@Controller('amazon/orcamentos')
@ApiTags('Orçamento')
@UseGuards(AuthGuard, RoleGuard)
export class OrcamentoController {
  constructor(
    private readonly orcamentoService: OrcamentoService,
    private readonly sincronizacaoService: SincronizacaoService,
  ) {}

  @Post()
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Criar um orçamento' })
  async criar(@Body(new ValidationPipe()) dados: any) {
    return this.orcamentoService.criar(dados);
  }

  @Get()
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Retornar todos os orçamentos' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'limite', required: false })
  @ApiQuery({ name: 'textoBusca', required: false })
  @ApiQuery({ name: 'usuarioId', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'versao', required: false })
  async buscarTodos(
    @Query('pagina') pagina: string = '1',
    @Query('limite') limite: string = '10',
    @Query('textoBusca') textoBusca: string = '',
    @Query('usuarioId') usuarioId: string = '',
    @Query('cargo') cargo: string = '',
    @Query('versao') versao: boolean = false,
  ) {
    const paginaParseada = parseInt(pagina, 10);
    const limiteParseado = parseInt(limite, 10);
    return this.orcamentoService.buscarTodos(paginaParseada, limiteParseado, textoBusca, usuarioId, cargo);
  }

  @Get(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Retornar um orçamento por ID' })
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
    return this.orcamentoService.buscarUm(id);
  }

  @Get('relatorio/exportar')
  @Roles('admin', 'vendedor')
  @ApiQuery({ name: 'usuarioId', required: false })
  @ApiQuery({ name: 'dataInicial', required: true })
  @ApiQuery({ name: 'dataFinal', required: true })
  @ApiOperation({ summary: 'Exportar relatório de orçamentos' })
  async exportarRelatorio(
    @Query('usuarioId') usuarioId: string,
    @Query('dataInicial') dataInicial: string,
    @Query('dataFinal') dataFinal: string,
  ) {
    return this.orcamentoService.exportarRelatorio(usuarioId, dataInicial, dataFinal);
  }

  @Patch(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Atualizar um orçamento por ID' })
  async atualizar(@Param('id', ParseUUIDPipe) id: string, @Body(new ValidationPipe()) dados: any) {
    return this.orcamentoService.atualizar(id, dados);
  }

  @Patch('/ativar/:id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Ativa um cliente por ID' })
  async ativar(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.orcamentoService.ativar(id);
  }

  @Delete(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Deletar um orçamento por ID' })
  async remover(
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
    await this.orcamentoService.remover(id);
    return res.status(204).send();
  }

  @Post(':orcamentoId/produtos')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Adicionar produto ao orçamento' })
  async adicionarProduto(
    @Param('orcamentoId', ParseUUIDPipe) orcamentoId: string,
    @Body(new ValidationPipe()) dados: any,
  ) {
    return this.orcamentoService.adicionarProduto({
      ...dados,
      orcamento: { connect: { id: orcamentoId } },
    });
  }

  @Patch('produtos/:id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Atualizar produto do orçamento por ID' })
  async atualizarProduto(@Param('id', ParseUUIDPipe) id: string, @Body(new ValidationPipe()) dados: any) {
    return this.orcamentoService.atualizarProduto(id, dados);
  }

  @Delete('produtos/:id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Remover produto do orçamento por ID' })
  async removerProduto(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    await this.orcamentoService.removerProduto(id);
    return res.status(204).send();
  }

  // **************************************** SINCRONIZAÇÃO ****************************************

  /*
     Essa rota retornará apenas os registros com a versão preenchida, trazendo somente o id e a versao

     Exemplo de payload enviado pelo front-end:
     [
      { "id": "d6e65069-7f5a-4a15-aa9f-9c94ec7105f9", "versao": 2 },
      { "id": "3b4c7dcb-ad1f-4e1e-afe3-65a623537ec9", "versao": 5 }
    ]
   */
  @Get('sincronizar/buscar-dessincronizados/local')
  async buscarDessincronizadosLocal(
    @Query('versao') versao: boolean = false,
    @Query('id') id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    return this.orcamentoService.buscarDessincronizadosLocal(versao, id);
  }

  /*
    Após a chamada acima, o front-end envia para esta rota o response anterior no corpo da requisição.
    Esta rota retornará os orçamentos que precisam ser atualizados localmente.
  
    Ela compara a versão enviada com a versão atual no servidor e retorna os registros cuja versão local está desatualizada.
  
    Exemplo de payload enviado pelo front-end:
    [
      { "id": "d6e65069-7f5a-4a15-aa9f-9c94ec7105f9", "versao": 2 },
      { "id": "3b4c7dcb-ad1f-4e1e-afe3-65a623537ec9", "versao": 5 }
    ]

    Exemplo de resposta:
  [
    {
      "id": "d6e65069-7f5a-4a15-aa9f-9c94ec7105f9",
      "valor_bruto": "25000.00",
      "valor_total_desconto": "2500.00",
      "percentual_comissao": "5.00",
      "desconto_total_percentual": "10.00",
      "valor_final": "22500.00",
      "forma_pagamento": "Pix",
      "prazo": "imediato",
      "observacao": "Cliente pediu urgência",
      "parcelas": 1,
      "codigo_finame": "FIN-NEW-01",
      "id_cli_fk": "11111111-aaaa-bbbb-cccc-111111111111",
      "id_usu_fk": "22222222-bbbb-cccc-dddd-222222222222",
      "versao": 3,
      "produtosOrcamento": [
        {
          "id": "prod-1",
          "quantidade": 2,
          "preco_unitario": "12500.00",
          "id_orc_fk": null,
          "id_pro_fk": "33333333-cccc-dddd-eeee-333333333333"
        }
      ]
    }
  ]
  */
  @Post('sincronizar/dessincronizados/servidor')
  async buscarDessincronizadosServidor(@Body() dados: SincronizacaoVersaoDto[]): Promise<Orcamento[]> {
    return this.orcamentoService.buscarDessincronizadosServidor(dados);
  }

  /*
  Após a chamada acima, o front-end receberá a resposta contendo os orçamentos atualizados.
  Com esses dados em mãos, o sistema poderá atualizar os orçamentos localmente.
  */

  /* 
  Após a chamada abaixo, o front-end receberá a reposta contendo os orçamentos para serem criados no servidor, passando o modo de criar.
  */
  @Post('sincronizar/local')
  async sincronizarLocal(
    @Body() orcamentos: CriarOrcamentoDto[],
    @Query('modo') modo: 'criar' | 'atualizar' = 'criar',
  ): Promise<any[]> {
    const resultados = [];
    for (const orcamento of orcamentos) {
      if (modo === 'atualizar') {
        const atualizado = await this.orcamentoService.atualizar(orcamento.id, orcamento);
        resultados.push(atualizado);
      } else {
        const criado = await this.orcamentoService.criar(orcamento);
        resultados.push(criado);
      }
    }
    await this.sincronizacaoService.criar('orcamento');
    return resultados;
  }

  /* Essa rota retorna todos os orçamentos que não foram cadastrados no servidor, ou seja, que não possuem uma versão definida. Com essa informação o front-end fará a chamada acima*/
  @Get('sincronizar/buscar-desconhecidos')
  async buscarDesconhecidos(): Promise<Orcamento[]> {
    return this.orcamentoService.buscarDesconhecidos();
  }

  @Get('sincronizar/atualizacoes/local')
  async buscarAtualizacoesLocal(): Promise<Orcamento[]> {
    return this.orcamentoService.buscarAtualizacoesLocal();
  }
}
