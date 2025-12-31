import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { RoleGuard } from 'src/commons/guards/role.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';

@Controller('amazon/estados')
@ApiTags('Estados')
@UseGuards(AuthGuard, RoleGuard)
@Roles('admin', 'vendedor')
export class StateController {
  constructor(private readonly estadoService: EstadoService) { }

  @Get()
  @ApiOperation({ summary: 'Retorna todas os estados' })
  async buscarTodos() {
    return this.estadoService.buscarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um estado por ID' })
  async buscarUm(@Param('id') id: string) {
    return this.estadoService.buscarUm(id);
  }
}
