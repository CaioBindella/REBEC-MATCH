import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Usuario } from '@prisma/client';

describe('Endpoints de Voluntário (E2E)', () => {
  let usuarioDeTeste: Usuario;
  let authToken: string; // <-- Variável para guardar o token

  // Antes de cada teste, limpa, cria um usuário E FAZ LOGIN para obter o token
  beforeEach(async () => {
    await prisma.voluntario.deleteMany({});
    await prisma.usuario.deleteMany({});

    // 1. Criar o usuário de base
    const usuarioData = {
      nome: 'Usuario',
      sobrenome: 'Para Voluntario',
      email: 'vol.user.e2e@exemplo.com',
      login: 'volusere2e',
      senha: 'senhaValida123',
      tipo: 'USER',
      tipo_especifico: 'VOLUNTARIO',
      sexo: 'FEMININO',
      data_nascimento: new Date('2001-10-10').toISOString(),
      telefone: '2211223344',
      endereco: 'Rua E2E, 101',
      documento: '10120230344',
    };
    await request(app).post('/api/v1/usuarios').send(usuarioData);
    
    // 2. Fazer login para obter um token
    const respostaLogin = await request(app)
      .post('/api/v1/usuarios/login')
      .send({
        email: usuarioData.email,
        senha: usuarioData.senha,
      });

    authToken = respostaLogin.body.token; // Armazena o token
    usuarioDeTeste = respostaLogin.body.user; // Armazena os dados do usuário
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/voluntarios', () => {
    it('deve criar um novo voluntário e retornar status 201 se autenticado', async () => {
      const dadosVoluntario = {
        nomeFicticio: 'Voluntário da API',
        distancia: 50,
        usuarioId: usuarioDeTeste.id,
      };

      const resposta = await request(app)
        .post('/api/v1/voluntarios')
        .set('Authorization', `Bearer ${authToken}`) // <-- Envia o token no cabeçalho
        .send(dadosVoluntario);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
    });

    it('deve retornar status 401 se não estiver autenticado', async () => {
      const dadosVoluntario = {
        nomeFicticio: 'Voluntário Sem Token',
        distancia: 1,
        usuarioId: usuarioDeTeste.id,
      };

      const resposta = await request(app)
        .post('/api/v1/voluntarios')
        // Desta vez, NÃO enviamos o token
        .send(dadosVoluntario);
      
      expect(resposta.status).toBe(401);
    });
  });
});