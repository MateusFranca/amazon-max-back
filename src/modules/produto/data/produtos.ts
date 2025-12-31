import { Decimal } from '@prisma/client/runtime/library';

interface Produto {
  id: string;
  marca: string;
  modelo: string;
  valor_completo: Decimal;
  valor_medio: Decimal;
  valor_reduzido: Decimal;
  valor_exclusivo: Decimal;
  foto?: { urlImagem: string; nomeImagem: string }[];
  descricao_tecnica: string;
  id_usu_fk: string;
  criadoEm: Date;
  atualizadoEm: Date;
  deletadoEm?: Date | null;
}

export const produtos: Produto[] = [
  {
    id: '56a7b8c9-d2e5-4f6a-9f1a-2b3c4d5e6f7a',
    marca: 'John Deere',
    modelo: 'Trator 5075E',
    valor_completo: new Decimal(319999.99),
    valor_medio: new Decimal(309999.99),
    valor_reduzido: new Decimal(289999.99),
    valor_exclusivo: new Decimal(279999.99),
    foto: [
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2693.jpg',
        nomeImagem: 'IMG_2693.jpg',
      },
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2694.jpg',
        nomeImagem: 'IMG_2694.jpg',
      },
    ],
    descricao_tecnica:
      'Trator agrícola com motor de 75 HP, transmissão PowerReverser 12F/12R, 4 cilindros, tração 4x4, sistema hidráulico com capacidade de 2900 kg.',
    id_usu_fk: '4168d537-7489-41a5-81e2-098c0c4ac9e6',
    criadoEm: new Date('2023-02-15T10:30:00Z'),
    atualizadoEm: new Date('2023-02-15T10:30:00Z'),
    deletadoEm: null,
  },
  {
    id: '67b8c9d2-e5f6-4a7b-9f1a-2b3c4d5e6f7a',
    marca: 'New Holland',
    modelo: 'Colheitadeira TC5070',
    valor_completo: new Decimal(809999.99),
    valor_medio: new Decimal(799999.99),
    valor_reduzido: new Decimal(769999.99),
    valor_exclusivo: new Decimal(759999.99),
    foto: [
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2693.jpg',
        nomeImagem: 'IMG_2693.jpg',
      },
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2694.jpg',
        nomeImagem: 'IMG_2694.jpg',
      },
    ],
    descricao_tecnica:
      'Colheitadeira com motor de 175 HP, sistema de trilha com rotor duplo, tanque graneleiro de 5000 litros, plataforma de corte de 20 pés.',
    id_usu_fk: '3a3a9881-045d-4a73-9bd4-397848cea9a7',
    criadoEm: new Date('2023-01-10T09:15:00Z'),
    atualizadoEm: new Date('2023-01-10T09:15:00Z'),
    deletadoEm: null,
  },
  {
    id: '78c9d2e5-f6a7-4b8c-9f1a-2b3c4d5e6f7a',
    marca: 'Massey Ferguson',
    modelo: 'Plantadeira MF 700',
    valor_completo: new Decimal(199999.99),
    valor_medio: new Decimal(195000.0),
    valor_reduzido: new Decimal(179999.99),
    valor_exclusivo: new Decimal(169999.99),
    foto: [
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2693.jpg',
        nomeImagem: 'IMG_2693.jpg',
      },
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2694.jpg',
        nomeImagem: 'IMG_2694.jpg',
      },
    ],
    descricao_tecnica:
      'Plantadeira com 15 linhas de plantio, sistema pneumático, distribuição precisa de sementes, reservatório de 1500 kg para sementes e 1000 kg para fertilizantes.',
    id_usu_fk: '4168d537-7489-41a5-81e2-098c0c4ac9e6',
    criadoEm: new Date('2023-03-05T14:20:00Z'),
    atualizadoEm: new Date('2023-03-05T14:20:00Z'),
    deletadoEm: null,
  },
  {
    id: '89d2e5f6-a7b8-4c9d-9f1a-2b3c4d5e6f7a',
    marca: 'Valtra',
    modelo: 'Trator BH184',
    valor_completo: new Decimal(479999.99),
    valor_medio: new Decimal(469999.99),
    valor_reduzido: new Decimal(439999.99),
    valor_exclusivo: new Decimal(429999.99),
    foto: [
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2693.jpg',
        nomeImagem: 'IMG_2693.jpg',
      },
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2694.jpg',
        nomeImagem: 'IMG_2694.jpg',
      },
    ],
    descricao_tecnica:
      'Trator agrícola com motor de 184 HP, transmissão PowerShift 36F/36R, turbo intercooler, tração 4x4, capacidade de levante hidráulico de 7500 kg.',
    id_usu_fk: '3a3a9881-045d-4a73-9bd4-397848cea9a7',
    criadoEm: new Date('2023-01-25T11:40:00Z'),
    atualizadoEm: new Date('2023-01-25T11:40:00Z'),
    deletadoEm: null,
  },
  {
    id: '90e5f6a7-b8c9-4d2e-9f1a-2b3c4d5e6f7a',
    marca: 'Case IH',
    modelo: 'Pulverizador Patriot 350',
    valor_completo: new Decimal(919999.99),
    valor_medio: new Decimal(909999.99),
    valor_reduzido: new Decimal(879999.99),
    valor_exclusivo: new Decimal(869999.99),
    foto: [
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2693.jpg',
        nomeImagem: 'IMG_2693.jpg',
      },
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2694.jpg',
        nomeImagem: 'IMG_2694.jpg',
      },
    ],
    descricao_tecnica:
      'Pulverizador autopropelido com tanque de 3500 litros, barra de 30 metros, motor de 250 HP, sistema de GPS, computador de bordo com ajuste automático de taxa.',
    id_usu_fk: '4168d537-7489-41a5-81e2-098c0c4ac9e6',
    criadoEm: new Date('2023-02-20T08:30:00Z'),
    atualizadoEm: new Date('2023-02-20T08:30:00Z'),
    deletadoEm: null,
  },
  {
    id: '01f6a7b8-c9d2-4e5f-9f1a-2b3c4d5e6f7a',
    marca: 'Jacto',
    modelo: 'Pulverizador Uniport 3030',
    valor_completo: new Decimal(699999.99),
    valor_medio: new Decimal(689999.99),
    valor_reduzido: new Decimal(659999.99),
    valor_exclusivo: new Decimal(649999.99),
    foto: [
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2693.jpg',
        nomeImagem: 'IMG_2693.jpg',
      },
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2694.jpg',
        nomeImagem: 'IMG_2694.jpg',
      },
    ],
    descricao_tecnica:
      'Pulverizador autopropelido com tanque de 3000 litros, barra de 27 metros, motor de 215 HP, sistema de controle automático de seções, suspensão pneumática.',
    id_usu_fk: '3a3a9881-045d-4a73-9bd4-397848cea9a7',
    criadoEm: new Date('2023-03-15T16:50:00Z'),
    atualizadoEm: new Date('2023-03-15T16:50:00Z'),
    deletadoEm: null,
  },
  {
    id: '12a7b8c9-d2e5-4f6a-9f1a-2b3c4d5e6f7a',
    marca: 'Stara',
    modelo: 'Semeadora Princesa',
    valor_completo: new Decimal(269999.99),
    valor_medio: new Decimal(265000.0),
    valor_reduzido: new Decimal(249999.99),
    valor_exclusivo: new Decimal(239999.99),
    foto: [
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2693.jpg',
        nomeImagem: 'IMG_2693.jpg',
      },
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2694.jpg',
        nomeImagem: 'IMG_2694.jpg',
      },
    ],
    descricao_tecnica:
      'Semeadora com 17 linhas, sistema pneumático, distribuição precisa de sementes, monitor de plantio, reservatório de 1800 kg para sementes e 1200 kg para fertilizantes.',
    id_usu_fk: '4168d537-7489-41a5-81e2-098c0c4ac9e6',
    criadoEm: new Date('2023-01-05T13:10:00Z'),
    atualizadoEm: new Date('2023-01-05T13:10:00Z'),
    deletadoEm: null,
  },
  {
    id: '23b8c9d2-e5f6-4a7b-9f1a-2b3c4d5e6f7a',
    marca: 'Kuhn',
    modelo: 'Grade Aradora GA 240',
    valor_completo: new Decimal(94999.99),
    valor_medio: new Decimal(91999.99),
    valor_reduzido: new Decimal(84999.99),
    valor_exclusivo: new Decimal(82999.99),
    foto: [
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2693.jpg',
        nomeImagem: 'IMG_2693.jpg',
      },
      {
        urlImagem:
          'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/gr500xifmria/b/bucket-pessoal/o/AmazonMax%2FProdutos%2F3871597a-2609-4d22-8a10-93dfa887203f%2FIMG_2694.jpg',
        nomeImagem: 'IMG_2694.jpg',
      },
    ],
    descricao_tecnica:
      'Grade aradora de arrasto com 20 discos de 28 polegadas, mancais em banho de óleo, estrutura reforçada, largura de trabalho de 2,40 metros.',
    id_usu_fk: '3a3a9881-045d-4a73-9bd4-397848cea9a7',
    criadoEm: new Date('2023-02-28T15:25:00Z'),
    atualizadoEm: new Date('2023-02-28T15:25:00Z'),
    deletadoEm: null,
  },
];
