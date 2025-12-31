import { Module, forwardRef } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AuthModule } from './modules/autenticacao/auth.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { EnderecoModule } from './modules/endereco/endereco.module';
import { CidadeModule } from './modules/base/cidade/cidade.module';
import { OrcamentoModule } from './modules/orcamento/orcamento.module';
import { CepController } from './modules/endereco/cep/cep.controller';
import { CepService } from './modules/endereco/cep/cep.service';
import { HealthController } from './commons/utils/shared/health/health.controller';
import { AuthService } from './modules/autenticacao/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HealthModule } from './commons/utils/shared/health/health.module';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    forwardRef(() => UsuarioModule),
    forwardRef(() => ProdutoModule),
    forwardRef(() => ClienteModule),
    forwardRef(() => OrcamentoModule),
    forwardRef(() => EnderecoModule),
    forwardRef(() => CidadeModule),
    forwardRef(() => AuthModule),
    forwardRef(() => HealthModule),
  ],
  controllers: [CepController, HealthController],
  providers: [CepService, AuthService, JwtService],
  exports: [],
})
export class AppModule { }
