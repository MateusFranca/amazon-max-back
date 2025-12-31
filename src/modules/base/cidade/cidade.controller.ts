import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CidadeService } from './cidade.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { RoleGuard } from 'src/commons/guards/role.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';

@Controller('amazon/cidades')
@ApiTags('Cidades')
@UseGuards(AuthGuard, RoleGuard)
@Roles('admin', 'vendedor')
export class CityController {
  constructor(private readonly cidadeService: CidadeService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todas as cidades' })
  async buscarTodos() {
    return this.cidadeService.buscarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma cidade por ID' })
  async buscarUm(@Param('id') id: string) {
    return this.cidadeService.buscarUm(id);
  }

  @Get('estado/:id')
  @ApiOperation({ summary: 'Retorna uma cidade por ID do estado' })
  async buscarCidadePorEstado(@Param('id') id: string) {
    return this.cidadeService.buscarCidadePorEstado(id);
  }
}
