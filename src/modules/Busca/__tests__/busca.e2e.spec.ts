import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Pesquisador, Usuario } from '@prisma/client';

describe('Endpoints de Busca (E2E)', () => {
  let pesquisadorDeTeste: Pesquisador;
  let authToken: string;

  // Configuração e login antes de cada teste
  beforeEach(async () => {
    // Limpeza
    await prisma.criterio.deleteMany({});
    await prisma.anuncio.deleteMany({});
    await prisma.busca.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // 1. Cria usuário via API
    const usuarioData = {
      nome: 'Busca',
      sobrenome: 'Tester',
      email: 'busca.e2e@exemplo.com',
      login: 'buscae2e',
      senha: 'senhaValida123',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('2000-01-01').toISOString(),
      telefone: '123456789',
      endereco: 'Rua da Busca, 1',
      documento: '12312312300',
    };
    await request(app).post('/api/v1/usuarios').send(usuarioData);

    // 2. Login para obter token
    const respostaLogin = await request(app)
      .post('/api/v1/usuarios/login')
      .send({ email: usuarioData.email, senha: usuarioData.senha });
    authToken = respostaLogin.body.token;
    const usuarioLogado: Usuario = respostaLogin.body.user;

    // 3. Cria pesquisador via API
    const respostaPesquisador = await request(app)
      .post('/api/v1/pesquisadores')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nomeFicticio: 'Pesquisador de Buscas',
        usuarioId: usuarioLogado.id,
      });
    pesquisadorDeTeste = respostaPesquisador.body;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/buscas', () => {
    it('deve criar uma nova busca e retornar status 201 se autenticado', async () => {
      const dadosBusca = {
        nome: 'Nova Busca de Voluntários para Estudo X',
        pesquisadorId: pesquisadorDeTeste.id,
      };

      const resposta = await request(app)
        .post('/api/v1/buscas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosBusca);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.nome).toBe(dadosBusca.nome);
    });

    it('deve retornar status 401 se não estiver autenticado', async () => {
      const dadosBusca = {
        nome: 'Busca Não Autorizada',
        pesquisadorId: pesquisadorDeTeste.id,
      };

      const resposta = await request(app)
        .post('/api/v1/buscas')
        .send(dadosBusca);
      
      expect(resposta.status).toBe(401);
    });
    
    it('deve retornar status 400 se o pesquisadorId não existir', async () => {
      const dadosBusca = {
        nome: 'Busca com Pesquisador Fantasma',
        pesquisadorId: 99999, // ID inexistente
      };

      const resposta = await request(app)
        .post('/api/v1/buscas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosBusca);
      
      expect(resposta.status).toBe(400);
      expect(resposta.body.message).toContain('Pesquisador não encontrado.');
    });
  });
});
