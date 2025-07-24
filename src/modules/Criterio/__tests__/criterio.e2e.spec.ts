import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Busca, Pesquisador, Usuario } from '@prisma/client';

describe('Endpoints de Critério (E2E)', () => {
  let buscaDeTeste: Busca;
  let authToken: string;

  // Configuração e login antes de cada teste
  beforeEach(async () => {
    // Limpeza
    await prisma.criterio.deleteMany({});
    await prisma.busca.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // 1. Cria usuário
    const usuarioData = {
      nome: 'Criterio',
      sobrenome: 'Tester',
      email: 'criterio.e2e@exemplo.com',
      login: 'criterioe2e',
      senha: 'senhaValida123',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('2001-01-01').toISOString(),
      telefone: '987654321',
      endereco: 'Rua do Critério, 2',
      documento: '32132132100',
    };
    await request(app).post('/api/v1/usuarios').send(usuarioData);

    // 2. Login
    const respostaLogin = await request(app)
      .post('/api/v1/usuarios/login')
      .send({ email: usuarioData.email, senha: usuarioData.senha });
    authToken = respostaLogin.body.token;
    const usuarioLogado: Usuario = respostaLogin.body.user;

    // 3. Cria pesquisador
    const respostaPesquisador = await request(app)
      .post('/api/v1/pesquisadores')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nomeFicticio: 'Pesquisador de Critérios', usuarioId: usuarioLogado.id });
    const pesquisadorDeTeste: Pesquisador = respostaPesquisador.body;

    // 4. Cria busca
    const respostaBusca = await request(app)
        .post('/api/v1/buscas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nome: 'Busca para Critérios', pesquisadorId: pesquisadorDeTeste.id });
    buscaDeTeste = respostaBusca.body;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/criterios', () => {
    it('deve criar um novo critério e retornar status 201 se autenticado', async () => {
      const dadosCriterio = {
        texto: 'Idade entre 18 e 25 anos',
        buscaId: buscaDeTeste.id,
      };

      const resposta = await request(app)
        .post('/api/v1/criterios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosCriterio);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.texto).toBe(dadosCriterio.texto);
    });

    it('deve retornar status 401 se não estiver autenticado', async () => {
      const dadosCriterio = {
        texto: 'Critério não autorizado',
        buscaId: buscaDeTeste.id,
      };

      const resposta = await request(app)
        .post('/api/v1/criterios')
        .send(dadosCriterio);
      
      expect(resposta.status).toBe(401);
    });
    
    it('deve retornar status 400 se a buscaId não existir', async () => {
      const dadosCriterio = {
        texto: 'Critério com Busca Fantasma',
        buscaId: 99999, // ID inexistente
      };

      const resposta = await request(app)
        .post('/api/v1/criterios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosCriterio);
      
      expect(resposta.status).toBe(400);
      expect(resposta.body.message).toContain('Busca não encontrada.');
    });
  });
});
