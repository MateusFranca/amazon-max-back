import { PrismaClient } from '@prisma/client';
import { usuarios } from '../src/modules/usuario/data/usuarios';
import * as fs from 'fs';
import { produtos } from '../src/modules/produto/data/produtos';
import { enderecos } from '../src/modules/endereco/data/endereco';
import { clientes } from '../src/modules/cliente/data/clientes';

const prisma = new PrismaClient();

function readSQLFile(fileName: string): string {
  const filePath = `./${fileName}`;
  return fs.readFileSync(filePath, 'utf8');
}

async function seedUsuario() {
  const usuariosExistentes = await prisma.usuario.findMany();
  if (usuariosExistentes.length === 0) {
    await prisma.usuario.createMany({
      data: usuarios,
    });
    console.log('Usuarios cadastrados com sucesso!');
  } else {
    console.log('Usuarios já existem!');
  }
}

async function seedProduto() {
  const produtosExistentes = await prisma.produto.findMany();
  if (produtosExistentes.length === 0) {
    await prisma.produto.createMany({
      data: produtos,
    });
    console.log('Produtos cadastrados com sucesso!');
  } else {
    console.log('Produtos já existem!');
  }
}

async function seedEstado() {
  const estadosExistentes = await prisma.estado.findMany();
  if (estadosExistentes.length === 0) {
    const script = readSQLFile('insert_estados.sql');
    await prisma.$executeRawUnsafe(script as any);
    console.log('Estados cadastrados com sucesso!');
  } else {
    console.log('Estados já existem, pulando cadastro.');
  }
}

async function seedCidade() {
  const cidadesExistentes = await prisma.cidade.findMany();
  if (cidadesExistentes.length === 0) {
    const script = readSQLFile('insert_cidades.sql');
    await prisma.$executeRawUnsafe(script as any);
    console.log('Cidades cadastradas com sucesso!');
  } else {
    console.log('Cidades já existem, pulando cadastro.');
  }
}

async function seedEndereco() {
  const enderecosExistentes = await prisma.endereco.findMany();
  if (enderecosExistentes.length === 0) {
    await prisma.endereco.createMany({
      data: enderecos,
    });
    console.log('Endereços cadastrados com sucesso!');
  } else {
    console.log('Endereços já existem, pulando cadastro.');
  }
}

async function seedCliente() {
  const clientesExistentes = await prisma.cliente.findMany();
  if (clientesExistentes.length === 0) {
    await prisma.cliente.createMany({
      data: clientes,
    });
    console.log('Clientes cadastrados com sucesso!');
  } else {
    console.log('Clientes já existem, pulando cadastro.');
  }
}

async function main() {
  try {
    await seedUsuario();
    await seedProduto();
    await seedEstado();
    await seedCidade();
    // await seedEndereco();
    // await seedCliente();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
