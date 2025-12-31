import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { StateController } from './estado.controller';
import { EstadoService } from './estado.service';
import { PrismaModule } from 'src/commons/prisma/prisma.module';
import { EstadoRepository } from './estado.repository';
import { EscaparDadosMiddleware } from 'src/commons/middlewares/escape-html-middleware';
import { CidadeRepository } from '../cidade/cidade.repository';
import { AuthService } from 'src/modules/autenticacao/auth.service';
import { UsuarioService } from 'src/modules/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from 'src/modules/usuario/usuario.repository';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { SincronizacaoRepository } from 'src/commons/utils/shared/sincronizacao/sincronizacao.repository';

@Module({
  imports: [PrismaModule],
  controllers: [StateController],
  providers: [
    EstadoService,
    EstadoRepository,
    CidadeRepository,
    AuthService,
    UsuarioService,
    JwtService,
    UsuarioRepository,
    SincronizacaoService,
    SincronizacaoRepository,
  ],
  exports: [EstadoService, EstadoRepository],
})
export class EstadoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EscaparDadosMiddleware)
      .exclude({ path: 'estados', method: RequestMethod.GET })
      .forRoutes(StateController);
  }
}
