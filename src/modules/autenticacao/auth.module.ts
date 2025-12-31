import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { PrismaModule } from 'src/commons/prisma/prisma.module';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { SincronizacaoRepository } from 'src/commons/utils/shared/sincronizacao/sincronizacao.repository';

@Module({
  imports: [UsuarioModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsuarioService,
    UsuarioRepository,
    JwtService,
    PrismaService,
    SincronizacaoService,
    SincronizacaoRepository,
  ],
})
export class AuthModule {}
