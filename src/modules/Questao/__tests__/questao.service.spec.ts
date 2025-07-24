import { PrismaClient } from '@prisma/client';
import { QuestaoService } from '../questao.service';
import { FormularioService } from '../../Formulario/formulario.service';
import { EstudoService } from '../../Estudo/estudo.service';
import { PesquisadorService } from '../../Pesquisador/pesquisador.service';
import { UsuarioService } from '../../Usuario/usuario.service';
import { Formulario } from '@prisma/client';
import { CreateQuestaoDto } from '../DTOs/questao.dto';

describe('QuestaoService', () => {
  let questaoService: QuestaoService;
  let formularioService: FormularioService;
  let estudoService: EstudoService;
  let pesquisadorService: PesquisadorService;
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;

  let formularioBase: Formulario;

  beforeAll(() => {
    prisma = new PrismaClient();
    questaoService = new QuestaoService();
    formularioService = new FormularioService();
    estudoService = new EstudoService();
    pesquisadorService = new PesquisadorService();
    usuarioService = new UsuarioService();
  });

  // Hook para limpar todas as tabelas na ordem correta ANTES de cada teste
  beforeEach(async () => {
    // A ordem de exclusão é inversa à da criação para evitar erros de chave estrangeira
    await prisma.questao.deleteMany({});
    await prisma.formulario.deleteMany({});
    await prisma.estudo.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.voluntario.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  // Hook para criar a cadeia de dependências necessária para os testes
  beforeEach(async () => {
    // 1. Cria usuário
    const usuario = await usuarioService.create({
      nome: 'Marie',
      sobrenome: 'Curie',
      email: 'curie@exemplo.com',
      login: 'curie',
      senha: 'radioatividade',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'FEMININO',
      data_nascimento: new Date('1867-11-07'),
      telefone: '18671934',
      endereco: 'Paris, França',
      documento: '186719341867',
    });

    // 2. Cria pesquisador
    const pesquisador = await pesquisadorService.create({
      nomeFicticio: 'A Pioneira',
      usuarioId: usuario.id,
    });

    // 3. Cria estudo
    const estudo = await estudoService.create({
      titulo: 'Estudo sobre Polônio e Rádio',
      pesquisadorId: pesquisador.id,
      codigoRegistro: 'RAD-001',
      status: 'CONCLUIDO',
      dataInicio: new Date('1898-01-01'),
      dataFim: new Date('1903-01-01'),
      informacoesGerais: 'Isolamento de novos elementos radioativos.',
    });

    // 4. Cria formulário base
    formularioBase = await formularioService.create({
      titulo: 'Protocolo de Laboratório',
      estudoId: estudo.id,
      texto_para_resposta_livre: 'Descreva os procedimentos.',
      data_criacao: new Date(),
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar uma nova questão de texto com sucesso', async () => {
      const dadosQuestao: CreateQuestaoDto = {
        formularioId: formularioBase.id,
        texto: 'Qual foi a maior dificuldade encontrada?',
        tipo: 'texto',
        obrigatorio: true,
      };

      const questaoCriada = await questaoService.create(dadosQuestao);

      expect(questaoCriada).toHaveProperty('id');
      expect(questaoCriada.texto).toBe(dadosQuestao.texto);
      expect(questaoCriada.tipo).toBe('texto');
      expect(questaoCriada.formularioId).toBe(formularioBase.id);
    });

    it('deve criar uma nova questão de opções com sucesso', async () => {
      const dadosQuestaoOpcoes: CreateQuestaoDto = {
        formularioId: formularioBase.id,
        texto: 'Qual elemento foi descoberto primeiro?',
        tipo: 'opcoes',
        obrigatorio: true,
        opcoes: ["Polônio", "Rádio", "Urânio"]
      };

      const questaoCriada = await questaoService.create(dadosQuestaoOpcoes);
      
      expect(questaoCriada).toHaveProperty('id');
      expect(questaoCriada.tipo).toBe('opcoes');
      expect(questaoCriada.opcoes).toBeDefined();
      expect(questaoCriada.opcoes).toEqual(["Polônio", "Rádio", "Urânio"]);
    });
    
    it('deve lançar um erro se o formulário não for encontrado', async () => {
      const dadosQuestao: CreateQuestaoDto = {
        formularioId: 99999, // ID inexistente
        texto: 'Esta questão nunca será criada.',
        tipo: 'texto',
        obrigatorio: false,
      };

      await expect(questaoService.create(dadosQuestao)).rejects.toThrow('Formulário não encontrado.');
    });
  });
});
