import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Usuario, Pesquisador } from '@prisma/client';

describe('Endpoints de Estudo (E2E)', () => {
  let pesquisadorUser: Usuario;
  let pesquisador: Pesquisador;
  let authToken: string;

  beforeEach(async () => {
    // Limpeza em cascata
    await prisma.estudo.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // 1. Cria usuário
    const usuarioData = {
      nome: 'Johannes',
      sobrenome: 'Kepler',
      email: 'kepler.e2e@exemplo.com',
      login: 'keplere2e',
      senha: 'leisplanetarias',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('1571-12-27').toISOString(),
      telefone: '15711630',
      endereco: 'Alemanha',
      documento: '157116301571',
    };
    await request(app).post('/api/v1/usuarios').send(usuarioData);

    // 2. Faz login para obter token e dados do usuário
    const respostaLogin = await request(app)
      .post('/api/v1/usuarios/login')
      .send({ email: usuarioData.email, senha: usuarioData.senha });

    authToken = respostaLogin.body.token;
    pesquisadorUser = respostaLogin.body.user;

    // 3. Cria a entidade Pesquisador para associar ao Estudo
    const respostaPesquisador = await request(app)
      .post('/api/v1/pesquisadores')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nomeFicticio: 'O Harmonizador dos Mundos',
        usuarioId: pesquisadorUser.id,
      });
    pesquisador = respostaPesquisador.body;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/estudos', () => {
    it('deve criar um novo estudo com sucesso se autenticado (201)', async () => {
      const dadosEstudo = {
        titulo: 'Sobre a Órbita Elíptica de Marte',
        pesquisadorId: pesquisador.id,
        codigoRegistro: 'MARS-001',
        status: 'CONCLUIDO',
        dataInicio: new Date('1609-01-01').toISOString(),
        dataFim: new Date('1619-01-01').toISOString(),
        informacoesGerais: 'Análise detalhada usando as observações de Tycho Brahe.',
      };

      const resposta = await request(app)
        .post('/api/v1/estudos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosEstudo);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.titulo).toBe(dadosEstudo.titulo);
    });

    it('deve falhar ao criar sem um token de autenticação (401)', async () => {
      const dadosEstudo = {
        titulo: 'Teste sem token',
        pesquisadorId: pesquisador.id,
        codigoRegistro: 'NO-TOKEN-01',
        status: 'PLANEJADO',
        dataInicio: new Date().toISOString(),
        dataFim: new Date().toISOString(),
        informacoesGerais: '...',
      };

      const resposta = await request(app)
        .post('/api/v1/estudos')
        .send(dadosEstudo); // Sem o .set('Authorization', ...)

      expect(resposta.status).toBe(401);
    });
  });
});
