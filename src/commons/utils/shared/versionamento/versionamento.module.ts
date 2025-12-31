import { Module, forwardRef } from '@nestjs/common';
import { VersionamentoService } from './versionamento.service';
import { OrcamentoModule } from 'src/modules/orcamento/orcamento.module';
import { ClienteModule } from 'src/modules/cliente/cliente.module';
import { EnderecoModule } from 'src/modules/endereco/endereco.module';

@Module({
  imports: [forwardRef(() => OrcamentoModule), forwardRef(() => ClienteModule), forwardRef(() => EnderecoModule)],
  providers: [VersionamentoService],
  exports: [VersionamentoService],
})
export class VersionamentoModule {}
