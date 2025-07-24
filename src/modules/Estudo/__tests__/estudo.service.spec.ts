import { PrismaClient } from '@prisma/client';
import { EstudoService } from '../estudo.service'; // Adapte o caminho se necessário
import { PesquisadorService } from '../../Pesquisador/pesquisador.service';
import { UsuarioService } from '../../Usuario/usuario.service';

describe('EstudoService', () => {
  let estudoService: EstudoService;
  let pesquisadorService: PesquisadorService;
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;

  // Variáveis para armazenar entidades base criadas para os testes
  let pesquisadorBase: { id: number };

  beforeAll(() => {
    prisma = new PrismaClient();
    estudoService = new EstudoService();
    pesquisadorService = new PesquisadorService();
    usuarioService = new UsuarioService();
  });

  // Antes de cada teste, limpa as tabelas e cria as dependências necessárias
  beforeEach(async () => {
    await prisma.estudo.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // Cria um usuário e um pesquisador base para associar aos estudos
    const usuario = await usuarioService.create({
      nome: 'Galileo',
      sobrenome: 'Galilei',
      email: 'galileo@exemplo.com',
      login: 'galileo',
      senha: 'telescopio123',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('1564-02-15'),
      telefone: '123456789',
      endereco: 'Pisa, Itália',
      documento: '987654321',
    });
    pesquisadorBase = await pesquisadorService.create({
      nomeFicticio: 'O Astrônomo',
      usuarioId: usuario.id,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar um novo estudo com sucesso', async () => {
      const dadosEstudo = {
        titulo: 'Estudo sobre as luas de Júpiter',
        pesquisadorId: pesquisadorBase.id,
        codigoRegistro: 'JUP-001',
        status: 'EM_ANDAMENTO',
        dataInicio: new Date(),
        dataFim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        informacoesGerais: 'Observação das quatro maiores luas de Júpiter.',
      };

      const estudoCriado = await estudoService.create(dadosEstudo);

      expect(estudoCriado).toHaveProperty('id');
      expect(estudoCriado.titulo).toBe(dadosEstudo.titulo);
      expect(estudoCriado.pesquisadorId).toBe(pesquisadorBase.id);
    });

    it('deve lançar um erro ao tentar criar um estudo com um pesquisadorId que não existe', async () => {
      const dadosEstudo = {
        titulo: 'Estudo Fantasma',
        pesquisadorId: 99999, // ID inexistente
        codigoRegistro: 'FANT-001',
        status: 'PLANEJADO',
        dataInicio: new Date(),
        dataFim: new Date(),
        informacoesGerais: '...',
      };

      await expect(estudoService.create(dadosEstudo)).rejects.toThrow('Pesquisador não encontrado.');
    });
  });
});
