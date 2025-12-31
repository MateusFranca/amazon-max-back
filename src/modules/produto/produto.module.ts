import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { PrismaModule } from 'src/commons/prisma/prisma.module';
import { ValidacaoUuidMiddleware } from 'src/commons/middlewares/uuid-check.middleware';
import { EscaparDadosMiddleware } from 'src/commons/middlewares/escape-html-middleware';
import { ProdutoRepository } from './produto.repository';
import { UsuarioRepository } from 'src/modules/usuario/usuario.repository';
import { UsuarioService } from 'src/modules/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../autenticacao/auth.service';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { SincronizacaoRepository } from 'src/commons/utils/shared/sincronizacao/sincronizacao.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutoController],
  providers: [
    ProdutoRepository,
    ProdutoService,
    UsuarioRepository,
    UsuarioService,
    AuthService,
    JwtService,
    SincronizacaoService,
    SincronizacaoRepository,
  ],
  exports: [ProdutoService],
})
export class ProdutoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidacaoUuidMiddleware)
      .exclude({ path: 'amazon/produtos/publico', method: RequestMethod.GET })
      .exclude({ path: 'amazon/produtos/sem-paginacao', method: RequestMethod.GET })
      .exclude({ path: 'amazon/produtos/ativas', method: RequestMethod.GET })
      .forRoutes({
        path: 'amazon/produtos/:id',
        method: RequestMethod.ALL,
      });
    consumer
      .apply(EscaparDadosMiddleware)
      .exclude({ path: 'amazon/produtos', method: RequestMethod.GET })
      .exclude({ path: 'amazon/produtos/publico', method: RequestMethod.GET })
      .forRoutes(ProdutoController);
  }
}
