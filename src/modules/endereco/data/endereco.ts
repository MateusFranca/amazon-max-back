interface Endereco {
  id: string;
  rua: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string;
  id_cid_fk: string;
  versao?: number;
}

export const enderecos: Endereco[] = [
  {
    id: '6b2e4e2d-320e-4c24-b534-ca5ccaf6751a',
    rua: 'Rua Ricardo Somenzari',
    bairro: 'Centro',
    cep: '76916000',
    numero: '3293',
    complemento: 'Casa',
    id_cid_fk: '1100304',
    versao: 1,
  },
  {
    id: '5b4366bd-e29f-40a7-9065-23e2d25e279b',
    rua: 'Rua das Flores',
    bairro: 'Centro',
    cep: '76916000',
    numero: '3293',
    complemento: 'Casa',
    id_cid_fk: '1100304',
    versao: 1,
  },
];
