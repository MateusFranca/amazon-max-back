import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CidadeService } from './cidade.service';
import { PrismaModule } from 'src/commons/prisma/prisma.module';
import { CityController } from './cidade.controller';
import { CidadeRepository } from './cidade.repository';
import { EscaparDadosMiddleware } from 'src/commons/middlewares/escape-html-middleware';
import { EstadoRepository } from '../estado/estado.repository';
import { AuthService } from 'src/modules/autenticacao/auth.service';
import { UsuarioService } from 'src/modules/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from 'src/modules/usuario/usuario.repository';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { SincronizacaoRepository } from 'src/commons/utils/shared/sincronizacao/sincronizacao.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CityController],
  providers: [
    CidadeService,
    CidadeRepository,
    EstadoRepository,
    AuthService,
    UsuarioService,
    JwtService,
    UsuarioRepository,
    SincronizacaoService,
    SincronizacaoRepository,
  ],
  exports: [CidadeService, CidadeRepository],
})
export class CidadeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EscaparDadosMiddleware)
      .exclude({ path: 'cidades', method: RequestMethod.GET })
      .forRoutes(CityController);
  }
}
