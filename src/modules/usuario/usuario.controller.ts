import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  ParseUUIDPipe,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CriarUsuarioDTO } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDTO } from './dto/atualizar-usuario.dto';
import { UsuarioService } from './usuario.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { RoleGuard } from 'src/commons/guards/role.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Usuario } from '@prisma/client';
import { SincronizacaoVersaoDto } from '../orcamento/dto/sincronizacao-versao.dto';

@Controller('amazon/usuarios')
@ApiTags('Usuarios')
@UseGuards(AuthGuard, RoleGuard)
@Roles('admin', 'vendedor')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um usuario' })
  async criar(@Body() dado: CriarUsuarioDTO) {
    return this.usuarioService.criar(dado);
  }

  @Get()
  @ApiOperation({ summary: 'Retornar todos os usuarios' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'limitePorPagina', required: false })
  @ApiQuery({ name: 'buscarTexto', required: false })
  async findAll(
    @Query('pagina') pagina: string = '1',
    @Query('limitePorPagina') limitePorPagina: string = '10',
    @Query('buscarTexto') buscarTexto: string = '',
  ) {
    const paginaAnalisada = parseInt(pagina, 10);
    const limiteAnalisado = parseInt(limitePorPagina, 10);
    return this.usuarioService.buscarTodos(paginaAnalisada, limiteAnalisado, buscarTexto);
  }

  @Get('nomes')
  @ApiOperation({ summary: 'Retornar todos os usuarios com nome' })
  async findAllNomes() {
    return this.usuarioService.buscarTodosNomes();
  }

  @Get('offiline')
  @ApiOperation({ summary: 'Retornar todos os usuarios para o armazenamento offline' })
  async findAllOffiline() {
    return this.usuarioService.buscarTodosOffline();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um usuario por ID' })
  async deletar(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    await this.usuarioService.deletar(id);
    return res.status(204).send();
  }

  @Patch('/ativar/:id')
  @ApiOperation({ summary: 'Ativa um usuario por ID' })
  async ativar(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usuarioService.ativar(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um usuario por ID' })
  async atualizar(@Body() dado: AtualizarUsuarioDTO, @Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.atualizar(id, dado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um usuario por ID' })
  async BuscarUm(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuarioService.buscarUm(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Retorna um usuario por email' })
  async BuscarPorEmail(@Param('email') email: string) {
    return this.usuarioService.buscarPorEmail(email);
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
    return this.usuarioService.buscarDessincronizadosLocal(versao, id);
  }

  /**
   * Recebe um array de {id, versao} e retorna os usuários que precisam ser atualizados localmente
   */
  @Post('sincronizar/dessincronizados/servidor')
  async buscarDessincronizadosServidor(@Body() dados: SincronizacaoVersaoDto[]): Promise<Usuario[]> {
    return this.usuarioService.buscarDessincronizadosServidor(dados);
  }

  /**
   * Recebe usuários para criar ou atualizar no servidor
   */
  @Post('sincronizar/local')
  async sincronizarLocal(
    @Body() usuarios: CriarUsuarioDTO[],
    @Query('modo') modo: 'criar' | 'atualizar' = 'criar',
  ): Promise<any[]> {
    const resultados = [];
    for (const usuario of usuarios) {
      if (modo === 'atualizar') {
        const atualizado = await this.usuarioService.atualizar(usuario.id, usuario);
        resultados.push(atualizado);
      } else {
        const criado = await this.usuarioService.criar(usuario);
        resultados.push(criado);
      }
    }
    // Se tiver serviço de sincronização, pode chamar aqui
    // await this.sincronizacaoService.criar('usuario');
    return resultados;
  }

  /**
   * Retorna todos os usuários que não foram cadastrados no servidor (sem versão definida)
   */
  @Get('sincronizar/buscar-desconhecidos')
  async buscarDesconhecidos(): Promise<Usuario[]> {
    return this.usuarioService.buscarDesconhecidos();
  }

  /**
   * Retorna todos os usuários que foram atualizados localmente e precisam ser sincronizados
   */
  @Get('sincronizar/atualizacoes/local')
  async buscarAtualizacoesLocal(): Promise<Usuario[]> {
    return this.usuarioService.buscarAtualizacoesLocal();
  }
}
