import { PrismaClient } from '@prisma/client';
import { VoluntarioService } from '../voluntario.service';
import { UsuarioService } from '../../Usuario/usuario.service';

describe('VoluntarioService', () => {
  let voluntarioService: VoluntarioService;
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;

  // Inicializa tudo antes dos testes começarem
  beforeAll(() => {
    prisma = new PrismaClient();
    voluntarioService = new VoluntarioService();
    usuarioService = new UsuarioService(); // Precisamos dele para criar usuários de base
  });

  // Antes de CADA teste, limpa as tabelas para evitar interferência
  // A ordem é importante por causa da chave estrangeira
  beforeEach(async () => {
    await prisma.voluntario.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  // Fecha a conexão com o banco ao final de tudo
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar um novo voluntário se o usuário associado existir', async () => {
      // 1. Criar um usuário de base para o teste
      const usuarioBase = await usuarioService.create({
        nome: 'Base',
        sobrenome: 'User',
        email: 'baseuser@exemplo.com',
        login: 'baseuser',
        senha: 'senha123',
        tipo: 'USER',
        tipo_especifico: 'VOLUNTARIO',
        sexo: 'MASCULINO',
        data_nascimento: new Date('1990-01-01'),
        telefone: '1122334455',
        endereco: 'Rua Base, 123',
        documento: '12345678901',
      });

      // 2. Criar o voluntário usando o ID do usuário de base
      const dadosVoluntario = {
        nomeFicticio: 'Herói Anônimo',
        distancia: 10,
        usuarioId: usuarioBase.id, // Link com o usuário criado
      };

      const voluntarioCriado = await voluntarioService.create(dadosVoluntario);

      expect(voluntarioCriado).toHaveProperty('id');
      expect(voluntarioCriado.nomeFicticio).toBe('Herói Anônimo');
      expect(voluntarioCriado.usuarioId).toBe(usuarioBase.id);
    });

    it('deve lançar um erro ao tentar criar um voluntário com um usuarioId que não existe', async () => {
      const dadosVoluntario = {
        nomeFicticio: 'Voluntário Fantasma',
        distancia: 5,
        usuarioId: 99999, // ID заведомо inexistente
      };

      // Esperamos que a chamada do método seja rejeitada com a mensagem de erro correta
      await expect(voluntarioService.create(dadosVoluntario)).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('findOne', () => {
    it('deve encontrar um voluntário pelo ID', async () => {
      // Setup: criar usuário e voluntário
      const usuarioBase = await usuarioService.create({ nome: 'Base', sobrenome: 'Find', email: 'find@exemplo.com', login: 'find', senha: '123', tipo: 'USER', tipo_especifico: 'VOLUNTARIO', sexo: 'FEMININO', data_nascimento: new Date(), telefone: '123', endereco: '123', documento: '123' });
      const voluntarioCriado = await voluntarioService.create({ nomeFicticio: 'FindMe', distancia: 1, usuarioId: usuarioBase.id });

      const voluntarioEncontrado = await voluntarioService.findOne(voluntarioCriado.id);
      
      expect(voluntarioEncontrado).toBeDefined();
      expect(voluntarioEncontrado!.id).toBe(voluntarioCriado.id);
    });

    it('deve lançar um erro se o voluntário não for encontrado', async () => {
        await expect(voluntarioService.findOne(999)).rejects.toThrow('Voluntário não encontrado.');
    });
  });
});
