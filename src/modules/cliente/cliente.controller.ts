import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ClienteService } from './cliente.service';
import { CriarClienteDTO } from './dto/criar-cliente.dto';
import { AtualizarClienteDTO } from './dto/atualizar-cliente.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { RoleGuard } from 'src/commons/guards/role.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { SincronizacaoVersaoDto } from 'src/modules/orcamento/dto/sincronizacao-versao.dto'; // ajuste o caminho se necessário
import { Cliente } from '@prisma/client';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';

@ApiTags('Clientes')
@Controller('amazon/clientes')
@UseGuards(AuthGuard, RoleGuard)
export class ClienteController {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly sincronizacaoService: SincronizacaoService, // adicionado
  ) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Criar novo cliente' })
  async criar(@Body() dado: CriarClienteDTO) {
    return this.clienteService.criar(dado);
  }

  @Get()
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'limitePorPagina', required: false })
  @ApiQuery({ name: 'buscarTexto', required: false })
  async listar(
    @Query('pagina') pagina: string = '1',
    @Query('limitePorPagina') limitePorPagina: string = '10',
    @Query('buscarTexto') buscarTexto: string = '',
  ) {
    const paginaAnalisada = parseInt(pagina, 10);
    const limiteAnalisado = parseInt(limitePorPagina, 10);
    return this.clienteService.buscarTodos(paginaAnalisada, limiteAnalisado, buscarTexto);
  }

  @Get('buscar/nome')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Buscar nome e documento' })
  async buscarPorNome(@Query('clientesBase') clientesBase?: string) {
    let idsArray: string[] = [];
    let atualizadosArray: string[] = [];
    let clientesBaseArray: { id: string; atualizadoEm: string }[] = [];

    if (clientesBase) {
      try {
        clientesBaseArray = JSON.parse(clientesBase);
        idsArray = clientesBaseArray.map((c) => c.id);
        atualizadosArray = clientesBaseArray.map((c) => c.atualizadoEm);
      } catch (e) {}
    }
    return this.clienteService.listarPorNome(idsArray, atualizadosArray);
  }

  @Get(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  async buscarUm(@Param('id', ParseUUIDPipe) id: string) {
    return this.clienteService.buscarUm(id);
  }

  @Patch(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Atualizar parcialmente os dados de um cliente' })
  async atualizarParcial(@Body() dado: AtualizarClienteDTO, @Param('id', ParseUUIDPipe) id: string) {
    return this.clienteService.atualizarCliente(id, dado);
  }

  @Delete(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Exclui um cliente por ID' })
  async remover(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    await this.clienteService.removerCliente(id);
    return res.status(204).send();
  }

  @Patch('/ativar/:id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Ativa um cliente por ID' })
  async ativar(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.clienteService.ativar(id);
  }

  // ===================== ROTAS DE SINCRONIZAÇÃO =====================

  /**
   * Retorna apenas os registros com a versão preenchida, trazendo somente o id e a versao
   */
  @Get('sincronizar/buscar-dessincronizados/local')
  async buscarDessincronizadosLocal(
    @Query('versao') versao: boolean = false,
    @Query('id') id?: string,
  ): Promise<Array<{ id: string; versao: number | null }>> {
    return this.clienteService.buscarDessincronizadosLocal(versao, id);
  }

  /**
   * Recebe um array de {id, versao} e retorna os clientes que precisam ser atualizados localmente
   */
  @Post('sincronizar/dessincronizados/servidor')
  async buscarDessincronizadosServidor(@Body() dados: SincronizacaoVersaoDto[]): Promise<Cliente[]> {
    return this.clienteService.buscarDessincronizadosServidor(dados);
  }

  /**
   * Recebe clientes para criar ou atualizar no servidor
   */
  @Post('sincronizar/local')
  async sincronizarLocal(
    @Body() clientes: CriarClienteDTO[],
    @Query('modo') modo: 'criar' | 'atualizar' = 'criar',
  ): Promise<any[]> {
    const resultados = [];
    for (const cliente of clientes) {
      if (modo === 'atualizar') {
        const atualizado = await this.clienteService.atualizarCliente(cliente.id, cliente);
        resultados.push(atualizado);
      } else {
        const criado = await this.clienteService.criar(cliente);
        resultados.push(criado);
      }
    }
    // Se tiver serviço de sincronização, pode chamar aqui
    await this.sincronizacaoService.criar('cliente');
    return resultados;
  }

  /**
   * Retorna todos os clientes que não foram cadastrados no servidor (sem versão definida)
   */
  @Get('sincronizar/buscar-desconhecidos')
  async buscarDesconhecidos(): Promise<Cliente[]> {
    return this.clienteService.buscarDesconhecidos();
  }

  /**
   * Retorna todos os clientes que foram atualizados localmente e precisam ser sincronizados
   */
  @Get('sincronizar/atualizacoes/local')
  async buscarAtualizacoesLocal(): Promise<Cliente[]> {
    return this.clienteService.buscarAtualizacoesLocal();
  }
}
