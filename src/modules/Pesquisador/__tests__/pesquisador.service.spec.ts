import { PrismaClient } from '@prisma/client';
import { PesquisadorService } from '../pesquisador.service';
import { UsuarioService } from '../../Usuario/usuario.service';

describe('PesquisadorService', () => {
  let pesquisadorService: PesquisadorService;
  let usuarioService: UsuarioService;
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
    pesquisadorService = new PesquisadorService();
    usuarioService = new UsuarioService(); // Necessário para criar usuários base
  });

  // Limpa as tabelas antes de cada teste
  beforeEach(async () => {
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('deve criar um novo pesquisador para um usuário existente', async () => {
      // 1. Cria um usuário que será o pesquisador
      const usuarioBase = await usuarioService.create({
        nome: 'Marie',
        sobrenome: 'Curie',
        email: 'marie.curie@exemplo.com',
        login: 'mariecurie',
        senha: 'senha123',
        tipo: 'USER',
        tipo_especifico: 'PESQUISADOR',
        sexo: 'FEMININO',
        data_nascimento: new Date('1867-11-07'),
        telefone: '1122334455',
        endereco: 'Rua da Ciência, 1',
        documento: '11111111111',
      });

      // 2. Cria o pesquisador, associando ao usuário
      const dadosPesquisador = {
        nomeFicticio: 'Cientista Pioneira',
        usuarioId: usuarioBase.id,
      };

      const pesquisadorCriado = await pesquisadorService.create(dadosPesquisador);

      expect(pesquisadorCriado).toHaveProperty('id');
      expect(pesquisadorCriado.nomeFicticio).toBe('Cientista Pioneira');
      expect(pesquisadorCriado.usuarioId).toBe(usuarioBase.id);
    });

    it('deve lançar um erro ao tentar criar um pesquisador com um usuarioId que não existe', async () => {
      const dadosPesquisador = {
        nomeFicticio: 'Pesquisador Fantasma',
        usuarioId: 99999, // ID que não existe
      };

      await expect(pesquisadorService.create(dadosPesquisador)).rejects.toThrow('Usuário não encontrado.');
    });
  });
});