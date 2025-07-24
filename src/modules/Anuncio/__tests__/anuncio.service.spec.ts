import { PrismaClient } from '@prisma/client';
import { AnuncioService } from '../anuncio.service';
import { BuscaService } from '../../Busca/busca.service';
import { PesquisadorService } from '../../Pesquisador/pesquisador.service';
import { UsuarioService } from '../../Usuario/usuario.service';
import { Busca } from '@prisma/client';
import { CreateAnuncioDto } from '../DTOs/anuncio.dto';

describe('AnuncioService', () => {
  let anuncioService: AnuncioService;
  let buscaService: BuscaService;
  let pesquisadorService: PesquisadorService;
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;
  let buscaBase: Busca;

  beforeAll(() => {
    prisma = new PrismaClient();
    anuncioService = new AnuncioService();
    buscaService = new BuscaService();
    pesquisadorService = new PesquisadorService();
    usuarioService = new UsuarioService();
  });

  // Limpeza e criação dos dados base antes de cada teste
  beforeEach(async () => {
    await prisma.anuncio.deleteMany({});
    await prisma.busca.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // Criação da cadeia de dependências
    const usuario = await usuarioService.create({
      nome: 'Grace',
      sobrenome: 'Hopper',
      email: 'hopper@exemplo.com',
      login: 'hopper',
      senha: 'cobol',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'FEMININO',
      data_nascimento: new Date('1906-12-09'),
      telefone: '19061992',
      endereco: 'New York, USA',
      documento: '190619921906',
    });

    const pesquisador = await pesquisadorService.create({
      nomeFicticio: 'A Rainha do COBOL',
      usuarioId: usuario.id,
    });
    
    buscaBase = await buscaService.create({
        nome: 'Busca por voluntários para depuração de sistemas',
        pesquisadorId: pesquisador.id,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar um novo anúncio com sucesso', async () => {
      const dadosAnuncio: CreateAnuncioDto = {
        mensagem: 'Procura-se voluntários com experiência em lógica de programação.',
        data_expiracao: new Date('2025-12-31'),
        buscaId: buscaBase.id,
      };

      const anuncioCriado = await anuncioService.create(dadosAnuncio);

      expect(anuncioCriado).toHaveProperty('id');
      expect(anuncioCriado.mensagem).toBe(dadosAnuncio.mensagem);
      expect(anuncioCriado.buscaId).toBe(buscaBase.id);
    });
    
    it('deve lançar um erro ao tentar criar um anúncio com uma buscaId inexistente', async () => {
      const dadosAnuncio: CreateAnuncioDto = {
        mensagem: 'Anúncio Órfão',
        data_expiracao: new Date(),
        buscaId: 99999, // ID inexistente
      };

      await expect(anuncioService.create(dadosAnuncio)).rejects.toThrow('Busca não encontrada.');
    });
  });
});
