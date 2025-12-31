import { forwardRef, Module } from '@nestjs/common';
import { OrcamentoService } from './orcamento.service';
import { OrcamentoController } from './orcamento.controller';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { OrcamentoRepository } from './orcamento.repository';
import { ProdutoOrcamentoRepository } from './produto-orcamento.repository';
import { AuthService } from '../autenticacao/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { UsuarioService } from '../usuario/usuario.service';
import { VersionamentoModule } from 'src/commons/utils/shared/versionamento/versionamento.module';
import { SincronizacaoService } from 'src/commons/utils/shared/sincronizacao/sincronizacao.service';
import { SincronizacaoRepository } from 'src/commons/utils/shared/sincronizacao/sincronizacao.repository';

@Module({
  controllers: [OrcamentoController],
  imports: [forwardRef(() => VersionamentoModule)],
  providers: [
    OrcamentoService,
    OrcamentoRepository,
    ProdutoOrcamentoRepository,
    PrismaService,
    AuthService,
    JwtService,
    UsuarioRepository,
    UsuarioService,
    SincronizacaoService,
    SincronizacaoRepository
  ],
  exports: [OrcamentoService, OrcamentoRepository],
})
export class OrcamentoModule { }
