import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Usuario } from '@prisma/client';

describe('Endpoints de Pesquisador (E2E)', () => {
  let pesquisadorUser: Usuario;
  let authToken: string;

  beforeEach(async () => {
    // Limpa as tabelas na ordem correta
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // 1. Cria um usuário do tipo PESQUISADOR para os testes
    const usuarioData = {
      nome: 'Isaac',
      sobrenome: 'Newton',
      email: 'newton.e2e@exemplo.com',
      login: 'newtone2e',
      senha: 'gravity123',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR', // Importante ser do tipo correto
      sexo: 'MASCULINO',
      data_nascimento: new Date('1643-01-04').toISOString(),
      telefone: '4455667788',
      endereco: 'Rua da Maçã, 1643',
      documento: '22233344455',
    };
    await request(app).post('/api/v1/usuarios').send(usuarioData);
    
    // 2. Faz login com esse usuário para obter um token válido
    const respostaLogin = await request(app)
      .post('/api/v1/usuarios/login')
      .send({
        email: usuarioData.email,
        senha: usuarioData.senha,
      });

    authToken = respostaLogin.body.token;
    pesquisadorUser = respostaLogin.body.user;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/pesquisadores', () => {
    it('deve criar um novo pesquisador com sucesso se autenticado (201)', async () => {
      const dadosPesquisador = {
        nomeFicticio: 'Físico Clássico',
        usuarioId: pesquisadorUser.id,
      };

      const resposta = await request(app)
        .post('/api/v1/pesquisadores')
        .set('Authorization', `Bearer ${authToken}`) // Envia o token
        .send(dadosPesquisador);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.usuarioId).toBe(pesquisadorUser.id);
    });

    it('deve falhar ao criar sem um token de autenticação (401)', async () => {
        const dadosPesquisador = {
            nomeFicticio: 'Anônimo',
            usuarioId: pesquisadorUser.id,
        };

        const resposta = await request(app)
            .post('/api/v1/pesquisadores')
            // Sem o header de autorização
            .send(dadosPesquisador);

        expect(resposta.status).toBe(401);
    });
  });
});
