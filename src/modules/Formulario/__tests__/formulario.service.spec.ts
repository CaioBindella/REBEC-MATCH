import { PrismaClient } from '@prisma/client';
import { FormularioService } from '../formulario.service'; // Adapte o caminho se necessário
import { EstudoService } from '../../Estudo/estudo.service';
import { PesquisadorService } from '../../Pesquisador/pesquisador.service';
import { UsuarioService } from '../../Usuario/usuario.service';
import { Estudo } from '@prisma/client';

describe('FormularioService', () => {
  let formularioService: FormularioService;
  let estudoService: EstudoService;
  let pesquisadorService: PesquisadorService;
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;

  let estudoBase: Estudo;

  beforeAll(() => {
    prisma = new PrismaClient();
    formularioService = new FormularioService();
    estudoService = new EstudoService();
    pesquisadorService = new PesquisadorService();
    usuarioService = new UsuarioService();
  });

  // Antes de cada teste, limpa as tabelas e cria as dependências necessárias
  beforeEach(async () => {
    // Limpa em ordem inversa de dependência
    await prisma.formulario.deleteMany({});
    await prisma.estudo.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // 1. Cria usuário
    const usuario = await usuarioService.create({
      nome: 'Charles',
      sobrenome: 'Darwin',
      email: 'darwin@exemplo.com',
      login: 'darwin',
      senha: 'evolucao123',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('1809-02-12'),
      telefone: '123123123',
      endereco: 'Galápagos',
      documento: '18091882',
    });

    // 2. Cria pesquisador
    const pesquisador = await pesquisadorService.create({
      nomeFicticio: 'O Naturalista',
      usuarioId: usuario.id,
    });

    // 3. Cria estudo base para os testes
    estudoBase = await estudoService.create({
      titulo: 'A Origem das Espécies',
      pesquisadorId: pesquisador.id,
      codigoRegistro: 'BEAGLE-01',
      status: 'CONCLUIDO',
      dataInicio: new Date('1831-12-27'),
      dataFim: new Date('1836-10-02'),
      informacoesGerais: 'Viagem a bordo do HMS Beagle.',
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar um novo formulário para um estudo existente', async () => {
      const dadosFormulario = {
        titulo: 'Questionário sobre Tentilhões',
        estudoId: estudoBase.id,
        texto_para_resposta_livre: 'Descreva as variações nos bicos.',
        data_criacao: new Date(),
      };

      const formularioCriado = await formularioService.create(dadosFormulario);
      
      expect(formularioCriado).toHaveProperty('id');
      expect(formularioCriado.titulo).toBe(dadosFormulario.titulo);
      expect(formularioCriado.estudoId).toBe(estudoBase.id);
    });

    it('deve lançar um erro ao tentar criar um formulário para um estudoId inexistente', async () => {
      const dadosFormulario = {
        titulo: 'Formulário Órfão',
        estudoId: 99999, // ID que não existe
        texto_para_resposta_livre: 'Isto vai falhar.',
        data_criacao: new Date(),
      };

      // Supondo que o EstudoService lança um erro 'Estudo não encontrado.'
      await expect(formularioService.create(dadosFormulario)).rejects.toThrow('Estudo não encontrado.');
    });
  });
});
