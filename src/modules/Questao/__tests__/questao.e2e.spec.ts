import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Usuario, Pesquisador, Estudo, Formulario } from '@prisma/client';
// Importe o DTO para garantir a tipagem correta
import { CreateQuestaoDto } from '../DTOs/questao.dto';

describe('Endpoints de Questão (E2E)', () => {
  let pesquisadorUser: Usuario;
  let pesquisador: Pesquisador;
  let estudo: Estudo;
  let formulario: Formulario;
  let authToken: string;

  beforeEach(async () => {
    // Etapa 0: Limpeza
    await prisma.questao.deleteMany({});
    await prisma.formulario.deleteMany({});
    await prisma.estudo.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.usuario.deleteMany({});

    // Etapa 1: Criar Usuário
    const usuarioData = {
      nome: 'Isaac',
      sobrenome: 'Newton',
      email: 'newton.e2e@exemplo.com',
      login: 'newtone2e',
      senha: 'gravidade123',
      tipo: 'USER',
      tipo_especifico: 'PESQUISADOR',
      sexo: 'MASCULINO',
      data_nascimento: new Date('1643-01-04').toISOString(),
      telefone: '16431727',
      endereco: 'Inglaterra',
      documento: '164317271643',
    };
    await request(app).post('/api/v1/usuarios').send(usuarioData);

    // Etapa 2: Fazer login
    const respostaLogin = await request(app)
      .post('/api/v1/usuarios/login')
      .send({ email: usuarioData.email, senha: usuarioData.senha });
    authToken = respostaLogin.body.token;
    pesquisadorUser = respostaLogin.body.user;

    // Etapa 3: Criar Pesquisador
    const respostaPesquisador = await request(app)
      .post('/api/v1/pesquisadores')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nomeFicticio: 'O Alquimista', usuarioId: pesquisadorUser.id });
    pesquisador = respostaPesquisador.body;

    // Etapa 4: Criar Estudo
    const dadosEstudo = {
      titulo: 'Philosophiæ Naturalis Principia Mathematica',
      pesquisadorId: pesquisador.id,
      codigoRegistro: 'PN-001',
      status: 'CONCLUIDO',
      dataInicio: new Date('1687-01-01').toISOString(),
      dataFim: new Date('1687-07-05').toISOString(),
      informacoesGerais: 'Leis do movimento e gravitação universal.',
    };
    const respostaEstudo = await request(app)
      .post('/api/v1/estudos')
      .set('Authorization', `Bearer ${authToken}`)
      .send(dadosEstudo);
    estudo = respostaEstudo.body;

    // Etapa 5: Criar Formulário
    const dadosFormulario = {
      titulo: 'Investigação da Luz e das Cores',
      estudoId: estudo.id,
      texto_para_resposta_livre: 'Descreva o experimento do prisma.',
      data_criacao: new Date().toISOString(),
    };
    const respostaFormulario = await request(app)
      .post('/api/v1/formularios')
      .set('Authorization', `Bearer ${authToken}`)
      .send(dadosFormulario);
    formulario = respostaFormulario.body;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/questoes', () => {
    it('deve criar uma nova questão com sucesso se autenticado (201)', async () => {
      // Adiciona a tipagem explícita aqui
      const dadosQuestao: CreateQuestaoDto = {
        formularioId: formulario.id,
        texto: 'Por que a maçã caiu?',
        tipo: 'texto', // Agora o tipo é inferido corretamente
        obrigatorio: false,
      };

      const resposta = await request(app)
        .post('/api/v1/questoes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosQuestao);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.texto).toBe('Por que a maçã caiu?');
    });

    it('deve falhar sem autenticação (401)', async () => {
      // Adiciona a tipagem explícita aqui também
      const dadosQuestao: CreateQuestaoDto = {
        formularioId: formulario.id,
        texto: 'Teste sem autenticação.',
        tipo: 'texto',
        obrigatorio: false,
      };

      const resposta = await request(app)
        .post('/api/v1/questoes')
        .send(dadosQuestao);

      expect(resposta.status).toBe(401);
    });
  });
});
