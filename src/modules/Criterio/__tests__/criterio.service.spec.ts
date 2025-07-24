import { PrismaClient } from '@prisma/client';
import { CriterioService } from '../criterio.service';
import { BuscaService } from '../../Busca/busca.service';
import { PesquisadorService } from '../../Pesquisador/pesquisador.service';
import { UsuarioService } from '../../Usuario/usuario.service';
import { Busca } from '@prisma/client';
import { CreateCriterioDto } from '../DTOs/criterio.dto';

describe('CriterioService', () => {
  let criterioService: CriterioService;
  let buscaService: BuscaService;
  let pesquisadorService: PesquisadorService;
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;
  let buscaBase: Busca;

  beforeAll(() => {
    prisma = new PrismaClient();
    criterioService = new CriterioService();
    buscaService = new BuscaService();
    pesquisadorService = new PesquisadorService();
    usuarioService = new UsuarioService();
  });

  // Limpeza e criação dos dados base antes de cada teste
  beforeEach(async () => {
    await prisma.criterio.deleteMany({});
    await prisma.busca.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // Criação da cadeia de dependências
    const usuario = await usuarioService.create({
      nome: 'Ada',
      sobrenome: 'Lovelace',
      email: 'lovelace@exemplo.com',
      login: 'lovelace',
      senha: 'analyticalengine',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'FEMININO',
      data_nascimento: new Date('1815-12-10'),
      telefone: '18151852',
      endereco: 'London, UK',
      documento: '181518521815',
    });

    const pesquisador = await pesquisadorService.create({
      nomeFicticio: 'A Primeira Programadora',
      usuarioId: usuario.id,
    });
    
    buscaBase = await buscaService.create({
        nome: 'Busca por Voluntários com Conhecimento em Lógica',
        pesquisadorId: pesquisador.id,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar um novo critério com sucesso', async () => {
      const dadosCriterio: CreateCriterioDto = {
        texto: 'Deve ter participado de estudos sobre matemática.',
        buscaId: buscaBase.id,
      };

      const criterioCriado = await criterioService.create(dadosCriterio);

      expect(criterioCriado).toHaveProperty('id');
      expect(criterioCriado.texto).toBe(dadosCriterio.texto);
      expect(criterioCriado.buscaId).toBe(buscaBase.id);
    });
    
    it('deve lançar um erro ao tentar criar um critério com uma buscaId inexistente', async () => {
      const dadosCriterio: CreateCriterioDto = {
        texto: 'Critério Órfão',
        buscaId: 99999, // ID inexistente
      };

      await expect(criterioService.create(dadosCriterio)).rejects.toThrow('Busca não encontrada.');
    });
  });
});
