import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario.service';
// A sua DTO real é mais complexa, vamos importá-la corretamente.
// Certifique-se de que o caminho de importação e o nome do tipo estão corretos.
import { CreateUsuarioDto } from '../DTOs/usuario.dto'; 

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
    usuarioService = new UsuarioService();
  });

  beforeEach(async () => {
    await prisma.usuario.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar um novo usuário com sucesso e retornar os dados sem a senha', async () => {
      // Objeto de teste agora completo com todos os campos obrigatórios
      const userData: CreateUsuarioDto = {
        nome: 'Teste',
        sobrenome: 'User',
        email: 'teste@exemplo.com',
        login: 'testeuser',
        senha: 'senha123',
        tipo: 'USER', // Usando 'USER' conforme o erro, ajuste se for 'ADMIN'
        tipo_especifico: 'PESQUISADOR',
        sexo: 'FEMININO',
        data_nascimento: new Date('1995-10-20'),
        telefone: '22999998888',
        endereco: 'Rua dos Testes, 123, Centro, Nova Friburgo, RJ',
        documento: '12345678900'
      };

      const result = await usuarioService.create(userData);

      expect(result).toHaveProperty('id');
      expect(result.nome).toBe(userData.nome);
      expect(result.email).toBe(userData.email);
      expect(result).not.toHaveProperty('senha');

      const userInDb = await prisma.usuario.findUnique({ where: { email: userData.email } });
      expect(userInDb).not.toBeNull();
    });

    it('deve lançar um erro se o e-mail já estiver em uso', async () => {
      // Cria um usuário primeiro
      await usuarioService.create({
        nome: 'Primeiro',
        sobrenome: 'User',
        email: 'duplicado@exemplo.com',
        login: 'primeiro',
        senha: 'senha123',
        tipo: 'USER',
        tipo_especifico: 'VOLUNTARIO',
        sexo: 'MASCULINO',
        data_nascimento: new Date('1990-01-01'),
        telefone: '21123456789',
        endereco: 'Rua A, 1',
        documento: '11122233344'
      });

      // Tenta criar outro com o mesmo e-mail
      const duplicateUserData: CreateUsuarioDto = {
        nome: 'Segundo',
        sobrenome: 'User',
        email: 'duplicado@exemplo.com',
        login: 'segundo',
        senha: 'senha456',
        tipo: 'USER',
        tipo_especifico: 'PESQUISADOR',
        sexo: 'FEMININO',
        data_nascimento: new Date('1992-02-02'),
        telefone: '21987654321',
        endereco: 'Rua B, 2',
        documento: '55566677788'
      };
      
      await expect(usuarioService.create(duplicateUserData)).rejects.toThrow('Email já está em uso.');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
        // Cria um usuário de teste completo para o login
        await usuarioService.create({
            nome: 'Login',
            sobrenome: 'User',
            email: 'login@exemplo.com',
            login: 'loginuser',
            senha: 'senhaCorreta',
            tipo: 'USER',
            tipo_especifico: 'PESQUISADOR',
            sexo: 'MASCULINO',
            data_nascimento: new Date('1988-08-08'),
            telefone: '2155554444',
            endereco: 'Rua do Login, 88',
            documento: '99988877766'
        });
    });

    it('deve autenticar um usuário com credenciais válidas e retornar um token', async () => {
        const result = await usuarioService.login({ email: 'login@exemplo.com', senha: 'senhaCorreta' });

        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('token');
        expect(typeof result.token).toBe('string');
        expect(result.user.email).toBe('login@exemplo.com');
    });

    it('deve lançar um erro para uma senha incorreta', async () => {
        await expect(usuarioService.login({ email: 'login@exemplo.com', senha: 'senhaErrada' })).rejects.toThrow('Email ou senha inválidos.');
    });
  });

  // Você pode continuar adicionando os outros testes (findOne, delete, etc.)
  // usando a mesma abordagem de criar um objeto de usuário completo.
});