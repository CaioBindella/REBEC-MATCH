import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Busca, Pesquisador, Usuario } from '@prisma/client';

describe('Endpoints de Anúncio (E2E)', () => {
  let buscaDeTeste: Busca;
  let authToken: string;

  // Configuração e login antes de cada teste
  beforeEach(async () => {
    // Limpeza
    await prisma.anuncio.deleteMany({});
    await prisma.busca.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // 1. Cria usuário
    const usuarioData = {
      nome: 'Anuncio',
      sobrenome: 'Tester',
      email: 'anuncio.e2e@exemplo.com',
      login: 'anuncioe2e',
      senha: 'senhaValida123',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('2002-02-02').toISOString(),
      telefone: '1122334455',
      endereco: 'Rua do Anúncio, 3',
      documento: '45645645600',
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
      .send({ nomeFicticio: 'Pesquisador de Anúncios', usuarioId: usuarioLogado.id });
    const pesquisadorDeTeste: Pesquisador = respostaPesquisador.body;

    // 4. Cria busca
    const respostaBusca = await request(app)
        .post('/api/v1/buscas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nome: 'Busca para Anúncios', pesquisadorId: pesquisadorDeTeste.id });
    buscaDeTeste = respostaBusca.body;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/anuncios', () => {
    it('deve criar um novo anúncio e retornar status 201 se autenticado', async () => {
      const dadosAnuncio = {
        mensagem: 'Voluntários necessários para estudo sobre interfaces.',
        data_expiracao: new Date('2026-01-01').toISOString(),
        buscaId: buscaDeTeste.id,
      };

      const resposta = await request(app)
        .post('/api/v1/anuncios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosAnuncio);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.mensagem).toBe(dadosAnuncio.mensagem);
    });

    it('deve retornar status 401 se não estiver autenticado', async () => {
        const dadosAnuncio = {
            mensagem: 'Anúncio não autorizado',
            data_expiracao: new Date().toISOString(),
            buscaId: buscaDeTeste.id,
          };

      const resposta = await request(app)
        .post('/api/v1/anuncios')
        .send(dadosAnuncio);
      
      expect(resposta.status).toBe(401);
    });
    
    it('deve retornar status 400 se a buscaId não existir', async () => {
        const dadosAnuncio = {
            mensagem: 'Anúncio com Busca Fantasma',
            data_expiracao: new Date().toISOString(),
            buscaId: 99999, // ID inexistente
          };

      const resposta = await request(app)
        .post('/api/v1/anuncios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosAnuncio);
      
      expect(resposta.status).toBe(400);
      expect(resposta.body.message).toContain('Busca não encontrada.');
    });
  });
});
