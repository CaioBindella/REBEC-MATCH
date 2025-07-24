import { PrismaClient } from '@prisma/client';
import { RespostaService } from '../resposta.service';
import { QuestaoService } from '../../Questao/questao.service';
import { FormularioService } from '../../Formulario/formulario.service';
import { EstudoService } from '../../Estudo/estudo.service';
import { BuscaService } from '../../Busca/busca.service';
import { PesquisadorService } from '../../Pesquisador/pesquisador.service';
import { VoluntarioService } from '../../Voluntario/voluntario.service';
import { UsuarioService } from '../../Usuario/usuario.service';
import { Busca, Questao, Voluntario } from '@prisma/client';
import { CreateRespostaDto } from '../DTOs/resposta.dto';

describe('RespostaService', () => {
  let respostaService: RespostaService;
  let prisma: PrismaClient;

  // Serviços necessários para criar a cadeia de dependências
  let questaoService: QuestaoService;
  let formularioService: FormularioService;
  let estudoService: EstudoService;
  let buscaService: BuscaService;
  let pesquisadorService: PesquisadorService;
  let voluntarioService: VoluntarioService;
  let usuarioService: UsuarioService;

  // Entidades base para os testes
  let voluntarioBase: Voluntario;
  let buscaBase: Busca;
  let questaoBase: Questao;

  beforeAll(() => {
    prisma = new PrismaClient();
    respostaService = new RespostaService();
    questaoService = new QuestaoService();
    formularioService = new FormularioService();
    estudoService = new EstudoService();
    buscaService = new BuscaService();
    pesquisadorService = new PesquisadorService();
    voluntarioService = new VoluntarioService();
    usuarioService = new UsuarioService();
  });

  // Limpeza e criação completa dos dados base
  beforeEach(async () => {
    await prisma.resposta.deleteMany({});
    await prisma.questao.deleteMany({});
    await prisma.formulario.deleteMany({});
    await prisma.estudo.deleteMany({});
    await prisma.busca.deleteMany({});
    await prisma.voluntario.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // --- Lado do Pesquisador ---
    const usuarioPesquisador = await usuarioService.create({
      nome: 'Richard', sobrenome: 'Feynman', email: 'feynman@exemplo.com', login: 'feynman', senha: 'qcd', tipo: 'USER', tipo_especifico: 'PESQUISADOR', sexo: 'MASCULINO', data_nascimento: new Date('1918-05-11'), telefone: '19181988', endereco: 'Caltech, USA', documento: '191819881918',
    });
    const pesquisador = await pesquisadorService.create({ nomeFicticio: 'O Explicador', usuarioId: usuarioPesquisador.id });
    const estudo = await estudoService.create({ titulo: 'Estudo de Diagramas', pesquisadorId: pesquisador.id, codigoRegistro: 'D-001', status: 'ATIVO', dataInicio: new Date(), dataFim: new Date(), informacoesGerais: 'Análise de interações de partículas.' });
    const formulario = await formularioService.create({ titulo: 'Questionário sobre Partículas', estudoId: estudo.id, texto_para_resposta_livre: '', data_criacao: new Date() });
    questaoBase = await questaoService.create({ texto: 'Qual sua partícula favorita?', tipo: 'texto', obrigatorio: true, formularioId: formulario.id });
    buscaBase = await buscaService.create({ nome: 'Busca para o Estudo de Diagramas', pesquisadorId: pesquisador.id });

    // --- Lado do Voluntário ---
    const usuarioVoluntario = await usuarioService.create({
        nome: 'Voluntario', sobrenome: 'Teste', email: 'vol.resposta@exemplo.com', login: 'volresposta', senha: 'senha123', tipo: 'USER', tipo_especifico: 'VOLUNTARIO', sexo: 'FEMININO', data_nascimento: new Date('1995-01-01'), telefone: '123456789', endereco: 'Rua dos Testes, 123', documento: '12345678901',
    });
    voluntarioBase = await voluntarioService.create({ nomeFicticio: 'Participante Ativo', distancia: 10, usuarioId: usuarioVoluntario.id });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar uma nova resposta com sucesso', async () => {
      const dadosResposta: CreateRespostaDto = {
        voluntarioId: voluntarioBase.id,
        busca_id: buscaBase.id,
        questaoId: questaoBase.id,
        conteudo: 'Neutrino, porque é misterioso.',
        marcado: false,
      };

      const respostaCriada = await respostaService.create(dadosResposta);

      expect(respostaCriada).toHaveProperty('id');
      expect(respostaCriada.conteudo).toBe(dadosResposta.conteudo);
      expect(respostaCriada.voluntarioId).toBe(voluntarioBase.id);
    });
    
    it('deve lançar um erro se a questaoId não existir', async () => {
        const dadosResposta: CreateRespostaDto = {
            voluntarioId: voluntarioBase.id, busca_id: buscaBase.id, questaoId: 99999, conteudo: '', marcado: false,
        };
        await expect(respostaService.create(dadosResposta)).rejects.toThrow('Questão não encontrada.');
    });
  });
});
