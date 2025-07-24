import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Usuario, Pesquisador, Estudo } from '@prisma/client';

describe('Endpoints de Formulário (E2E)', () => {
  let pesquisadorUser: Usuario;
  let pesquisador: Pesquisador;
  let estudo: Estudo;
  let authToken: string;

  beforeEach(async () => {
    // Limpeza em cascata
    await prisma.formulario.deleteMany({});
    await prisma.estudo.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // Etapa 1: Criar Usuário
    const usuarioData = {
      nome: 'Gregor',
      sobrenome: 'Mendel',
      email: 'mendel.e2e@exemplo.com',
      login: 'mendele2e',
      senha: 'genetica123',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('1822-07-20').toISOString(),
      telefone: '18221884',
      endereco: 'Mosteiro de Brno',
      documento: '182218841822',
    };
    await request(app).post('/api/v1/usuarios').send(usuarioData);

    // Etapa 2: Fazer login para obter token e dados
    const respostaLogin = await request(app)
      .post('/api/v1/usuarios/login')
      .send({ email: usuarioData.email, senha: usuarioData.senha });

    authToken = respostaLogin.body.token;
    pesquisadorUser = respostaLogin.body.user;

    // Etapa 3: Criar a entidade Pesquisador
    const respostaPesquisador = await request(app)
      .post('/api/v1/pesquisadores')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nomeFicticio: 'O Pai da Genética',
        usuarioId: pesquisadorUser.id,
      });
    pesquisador = respostaPesquisador.body;

    // Etapa 4: Criar a entidade Estudo
    const dadosEstudo = {
      titulo: 'Experimentos com Ervilhas',
      pesquisadorId: pesquisador.id,
      codigoRegistro: 'PEA-001',
      status: 'CONCLUIDO',
      dataInicio: new Date('1856-01-01').toISOString(),
      dataFim: new Date('1863-01-01').toISOString(),
      informacoesGerais: 'Estudo sobre hereditariedade em ervilhas-de-cheiro.',
    };
    const respostaEstudo = await request(app)
      .post('/api/v1/estudos')
      .set('Authorization', `Bearer ${authToken}`)
      .send(dadosEstudo);
    estudo = respostaEstudo.body;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/formularios', () => {
    it('deve criar um novo formulário com sucesso se autenticado (201)', async () => {
      const dadosFormulario = {
        titulo: 'Questionário de Características',
        estudoId: estudo.id,
        texto_para_resposta_livre: 'Anote a cor e a textura das sementes.',
        data_criacao: new Date().toISOString(),
      };

      const resposta = await request(app)
        .post('/api/v1/formularios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosFormulario);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.titulo).toBe('Questionário de Características');
    });

    it('deve falhar ao criar sem um token de autenticação (401)', async () => {
      const dadosFormulario = {
        titulo: 'Teste sem token',
        estudoId: estudo.id,
        texto_para_resposta_livre: '...',
        data_criacao: new Date().toISOString(),
      };

      const resposta = await request(app)
        .post('/api/v1/formularios')
        .send(dadosFormulario);

      expect(resposta.status).toBe(401);
    });
  });
});
