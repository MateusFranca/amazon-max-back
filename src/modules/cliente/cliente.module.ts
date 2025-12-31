import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { ClienteRepository } from './cliente.repository';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { PrismaModule } from 'src/commons/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ValidacaoUuidMiddleware } from 'src/commons/middlewares/uuid-check.middleware';
import { AuthService } from '../autenticacao/auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { VersionamentoService } from 'src/commons/utils/shared/versionamento/versionamento.service';
import { SincronizacaoRepository } from 'src/commons/utils/shared/sincronizacao/sincronizacao.repository';
import { OrcamentoRepository } from '../orcamento/orcamento.repository';
import { EnderecoRepository } from '../endereco/endereco.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ClienteController],
  providers: [
    ClienteService,
    ClienteRepository,
    PrismaService,
    AuthService,
    JwtService,
    UsuarioService,
    UsuarioRepository,
    SincronizacaoService,
    VersionamentoService,
    SincronizacaoRepository,
    OrcamentoRepository,
    EnderecoRepository,
  ],
  exports: [ClienteService, ClienteRepository],
})
export class ClienteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidacaoUuidMiddleware)
      .exclude({ path: 'amazon/clientes/buscar/nome', method: RequestMethod.GET })
      .forRoutes(
        { path: 'amazon/clientes/:id', method: RequestMethod.GET },
        { path: 'amazon/clientes/:id', method: RequestMethod.PATCH },
        { path: 'amazon/clientes/:id', method: RequestMethod.DELETE },
      );
  }
}
