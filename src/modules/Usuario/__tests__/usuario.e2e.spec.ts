import request from 'supertest';
import { app } from '../../../app'; // Importe sua instância do app Express
import { prisma } from '../../../shared/config/prisma'; // Importe o cliente Prisma

describe('Endpoints de Usuário (E2E)', () => {
  beforeEach(async () => {
    await prisma.usuario.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/usuarios', () => {
    it('deve ser capaz de criar um novo usuário e retornar status 201', async () => {
      const userData = {
        nome: 'E2E Test',
        sobrenome: 'User',
        email: 'e2e@exemplo.com',
        login: 'e2euser',
        senha: 'senhaSegura123',
        tipo: 'USER',
        tipo_especifico: 'PESQUISADOR',
        sexo: 'MASCULINO',
        data_nascimento: new Date('1999-12-31').toISOString(),
        telefone: '11987654321',
        endereco: 'Rua dos Testes E2E, 404',
        documento: '12312312345',
      };

      // CORREÇÃO: Usando a rota completa
      const response = await request(app)
        .post('/api/v1/usuarios')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
    });

    it('deve retornar status 400 se o e-mail já existir', async () => {
      const userData = {
        nome: 'Existente',
        sobrenome: 'User',
        email: 'existente@exemplo.com',
        login: 'existente',
        senha: 'senha123',
        tipo: 'USER',
        tipo_especifico: 'VOLUNTARIO',
        sexo: 'FEMININO',
        data_nascimento: new Date('1990-01-01').toISOString(),
        telefone: '22123456789',
        endereco: 'Rua A, 10',
        documento: '11122233300',
      };
      // CORREÇÃO: Usando a rota completa para criar o primeiro usuário
      await request(app).post('/api/v1/usuarios').send(userData);

      // CORREÇÃO: Usando a rota completa para tentar criar o segundo
      const response = await request(app).post('/api/v1/usuarios').send(userData);

      expect(response.status).toBe(400);
      // A mensagem de erro vem do seu service, então a rota está funcionando
      expect(response.body.message).toContain('Email já está em uso');
    });
  });

  // Assumindo que a rota de login é um sub-recurso de /usuarios
  describe('POST /api/v1/usuarios/login', () => {
    beforeEach(async () => {
      const userData = {
        nome: 'Login Test',
        sobrenome: 'User',
        email: 'login.e2e@exemplo.com',
        login: 'logine2e',
        senha: 'senhaCorreta',
        tipo: 'USER',
        tipo_especifico: 'PESQUISADOR',
        sexo: 'MASCULINO',
        data_nascimento: new Date('1985-05-15').toISOString(),
        telefone: '3344445555',
        endereco: 'Rua do Login, 15',
        documento: '33344455566',
      };
      // CORREÇÃO: Usando a rota completa para criar o usuário de teste
      await request(app).post('/api/v1/usuarios').send(userData);
    });

    it('deve autenticar com credenciais válidas e retornar status 200 com um token', async () => {
      // CORREÇÃO: Usando a rota de login completa
      const response = await request(app)
        .post('/api/v1/usuarios/login')
        .send({
          email: 'login.e2e@exemplo.com',
          senha: 'senhaCorreta',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });
  });
});