import { Cidade } from 'src/modules/base/cidade/interface/cidade.interface';

export interface Endereco {
  id: string;
  rua: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string;
  cidade: Cidade;
}
