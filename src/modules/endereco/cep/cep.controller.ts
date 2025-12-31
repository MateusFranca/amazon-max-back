import { Controller, Get, Param } from '@nestjs/common';
import { CepService } from './cep.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cep')
@Controller('amazon/cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  async buscarEnderecoPeloCep(@Param('cep') cep: string) {
    const endereco = await this.cepService.buscarEnderecoPeloCep(cep);
    return endereco;
  }
}
