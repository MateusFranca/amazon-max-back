import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EnderecoController } from './endereco.controller';
import { EnderecoService } from './endereco.service';
import { PrismaModule } from 'src/commons/prisma/prisma.module';
import { EnderecoRepository } from './endereco.repository';
import { CidadeRepository } from 'src/modules/base/cidade/cidade.repository';
import { CidadeService } from 'src/modules/base/cidade/cidade.service';
import { EscaparDadosMiddleware } from 'src/commons/middlewares/escape-html-middleware';
import { UuidExists } from 'src/commons/decorators/uuid-exists.decorator';
import { EstadoModule } from '../base/estado/estado.module';
import { EstadoRepository } from '../base/estado/estado.repository';
import { AuthService } from '../autenticacao/auth.service';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { VersionamentoService } from 'src/commons/utils/shared/versionamento/versionamento.service';
import { SincronizacaoRepository } from 'src/commons/utils/shared/sincronizacao/sincronizacao.repository';
import { OrcamentoRepository } from '../orcamento/orcamento.repository';
import { ClienteRepository } from '../cliente/cliente.repository';

@Module({
  imports: [PrismaModule, EstadoModule],
  controllers: [EnderecoController],
  providers: [
    EnderecoService,
    EnderecoRepository,
    CidadeService,
    CidadeRepository,
    EstadoRepository,
    UuidExists,
    AuthService,
    UsuarioService,
    UsuarioRepository,
    JwtService,
    SincronizacaoService,
    VersionamentoService,
    SincronizacaoRepository,
    OrcamentoRepository,
    ClienteRepository,
  ],
  exports: [EnderecoService, EnderecoRepository, CidadeRepository],
})
export class EnderecoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EscaparDadosMiddleware)
      .exclude({ path: 'endereco', method: RequestMethod.GET })
      .forRoutes(EnderecoController);
  }
}
