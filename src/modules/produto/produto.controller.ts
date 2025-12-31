import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
  Res,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CriarProdutoDTO } from './dto/criar-produto.dto';
import { AtualizarProdutoDTO } from './dto/atualizar-produto.dto';
import { ProdutoService } from './produto.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { RoleGuard } from 'src/commons/guards/role.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';

@Controller('amazon/produtos')
@ApiTags('Produto')
@UseGuards(AuthGuard, RoleGuard)
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Cria um produto' })
  async criar(@Body(new ValidationPipe()) dados: CriarProdutoDTO) {
    return this.produtoService.criar(dados);
  }

  @Get()
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Retornar todos os produtos' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'limite', required: false })
  @ApiQuery({ name: 'textoBusca', required: false })
  async buscarTodos(
    @Query('pagina') pagina: string = '1',
    @Query('limite') limite: string = '5',
    @Query('textoBusca') textoBusca: string = '',
  ) {
    const paginaParseada = parseInt(pagina, 10);
    const limiteParseado = parseInt(limite, 10);
    return this.produtoService.buscarTodos(paginaParseada, limiteParseado, textoBusca);
  }

  @Get('sem-paginacao')
  @Roles('admin', 'vendedor')
  async buscarSemPaginacao() {
    return this.produtoService.buscarSemPaginacao();
  }

  @Delete(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Deletar um produto por ID' })
  async remove(
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
    await this.produtoService.remover(id);
    return res.status(204).send();
  }

  @Get(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Retornar um produto por ID' })
  async buscarUm(@Param('id', ParseUUIDPipe) id: string) {
    return this.produtoService.buscarUm(id);
  }

  @Patch('/ativar/:id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Ativar um produto por ID' })
  async ativar(@Param('id', ParseUUIDPipe) id: string, @Body(new ValidationPipe()) dados: AtualizarProdutoDTO) {
    return this.produtoService.ativar(id, dados);
  }

  @Patch(':id')
  @Roles('admin', 'vendedor')
  @ApiOperation({ summary: 'Atualizar um produto por ID' })
  async atualizar(@Param('id', ParseUUIDPipe) id: string, @Body(new ValidationPipe()) dados: AtualizarProdutoDTO) {
    return this.produtoService.atualizar(id, dados);
  }

  @Put('imagens/:id')
  @Roles('admin', 'vendedor')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'foto', maxCount: 6 }]))
  @ApiOperation({ summary: 'Adicionar imagens a um produto' })
  async criarArquivo(@Param('id', ParseUUIDPipe) id: string, @UploadedFiles() files: { foto?: Express.Multer.File[] }) {
    const fotos = files.foto || [];

    return this.produtoService.anexarImagem(fotos, id);
  }
}
