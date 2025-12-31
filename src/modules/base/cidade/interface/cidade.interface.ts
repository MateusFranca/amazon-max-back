import { Estado } from 'src/modules/base/estado/interface/estado.interface';

export interface Cidade {
  id: string;
  nome: string;
  estado: Estado;
}
