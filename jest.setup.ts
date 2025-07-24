// jest.setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Este bloco será executado antes de CADA arquivo de teste
beforeAll(async () => {
  // A ordem aqui é crucial! Delete os modelos que dependem de outros primeiro.
  await prisma.resposta.deleteMany({});
  await prisma.anuncio.deleteMany({});
  await prisma.criterio.deleteMany({});
  await prisma.busca.deleteMany({});
  await prisma.questao.deleteMany({});
  await prisma.formulario.deleteMany({});
  await prisma.estudo.deleteMany({});
  await prisma.pesquisador.deleteMany({});
  await prisma.voluntario.deleteMany({});
  await prisma.usuario.deleteMany({});
});

// Após todos os testes, fecha a conexão
afterAll(async () => {
  await prisma.$disconnect();
});