import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { PrismaModule } from 'src/commons/prisma/prisma.module';
import { ValidacaoUuidMiddleware } from 'src/commons/middlewares/uuid-check.middleware';
import { UsuarioRepository } from './usuario.repository';
import { EmailIsUniqueValidator } from 'src/commons/decorators/email-is-unique.decorator';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../autenticacao/auth.service';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { SincronizacaoRepository } from 'src/commons/utils/shared/sincronizacao/sincronizacao.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    UsuarioRepository,
    EmailIsUniqueValidator,
    AuthService,
    JwtService,
    SincronizacaoService,
    SincronizacaoRepository,
  ],
  exports: [UsuarioService],
})
export class UsuarioModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidacaoUuidMiddleware)
      .exclude({ path: 'cme/usuario/recuperar-senha', method: RequestMethod.POST })
      .forRoutes({
        path: 'cme/usuario/:id',
        method: RequestMethod.ALL,
      });
  }
}
