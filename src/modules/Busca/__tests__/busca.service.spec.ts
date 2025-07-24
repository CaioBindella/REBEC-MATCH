import { PrismaClient } from '@prisma/client';
import { BuscaService } from '../busca.service';
import { PesquisadorService } from '../../Pesquisador/pesquisador.service';
import { UsuarioService } from '../../Usuario/usuario.service';
import { Pesquisador } from '@prisma/client';
import { CreateBuscaDto } from '../DTOs/busca.dto';

describe('BuscaService', () => {
  let buscaService: BuscaService;
  let pesquisadorService: PesquisadorService;
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;
  let pesquisadorBase: Pesquisador;

  beforeAll(() => {
    prisma = new PrismaClient();
    buscaService = new BuscaService();
    pesquisadorService = new PesquisadorService();
    usuarioService = new UsuarioService();
  });

  // Limpeza e criação dos dados base antes de cada teste
  beforeEach(async () => {
    // Limpeza em ordem inversa para evitar erros de chave estrangeira
    await prisma.criterio.deleteMany({});
    await prisma.anuncio.deleteMany({});
    await prisma.busca.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // Criação da cadeia de dependências
    const usuario = await usuarioService.create({
      nome: 'Alan',
      sobrenome: 'Turing',
      email: 'turing@exemplo.com',
      login: 'turing',
      senha: 'enigma',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('1912-06-23'),
      telefone: '19121954',
      endereco: 'Bletchley Park, UK',
      documento: '191219541912',
    });

    pesquisadorBase = await pesquisadorService.create({
      nomeFicticio: 'O Criptoanalista',
      usuarioId: usuario.id,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar uma nova busca com sucesso', async () => {
      const dadosBusca: CreateBuscaDto = {
        nome: 'Análise de Padrões em Voluntários',
        pesquisadorId: pesquisadorBase.id,
      };

      const buscaCriada = await buscaService.create(dadosBusca);

      expect(buscaCriada).toHaveProperty('id');
      expect(buscaCriada.nome).toBe(dadosBusca.nome);
      expect(buscaCriada.pesquisadorId).toBe(pesquisadorBase.id);
    });
    
    it('deve lançar um erro ao tentar criar uma busca com um pesquisadorId inexistente', async () => {
      const dadosBusca: CreateBuscaDto = {
        nome: 'Busca Fantasma',
        pesquisadorId: 99999, // ID inexistente
      };

      await expect(buscaService.create(dadosBusca)).rejects.toThrow('Pesquisador não encontrado.');
    });
  });
});
