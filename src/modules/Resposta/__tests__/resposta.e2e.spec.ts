import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../shared/config/prisma';
import { Busca, Pesquisador, Questao, Usuario, Voluntario } from '@prisma/client';

describe('Endpoints de Resposta (E2E)', () => {
  let pesquisadorDeTeste: Pesquisador;
  let voluntarioDeTeste: Voluntario;
  let buscaDeTeste: Busca;
  let questaoDeTeste: Questao;
  let tokenPesquisador: string;
  let tokenVoluntario: string;

  beforeEach(async () => {
    // Adicionada limpeza do banco para evitar poluição entre os testes
    await prisma.resposta.deleteMany({});
    await prisma.anuncio.deleteMany({});
    await prisma.criterio.deleteMany({});
    await prisma.busca.deleteMany({});
    await prisma.questao.deleteMany({});
    await prisma.formulario.deleteMany({});
    await prisma.estudo.deleteMany({});
    await prisma.pesquisador.deleteMany({});
    await prisma.voluntario.deleteMany({});
    await prisma.usuario.deleteMany({});

    // --- Setup do Pesquisador e seus dados (com validações) ---
    const userPesquisadorData = { nome: 'Pesq', sobrenome: 'Resp', email: 'pesq.resp@exemplo.com', login: 'pesqresp', senha: 'senhaForte123', tipo: 'USER', tipo_especifico: 'PESQUISADOR', sexo: 'MASCULINO', data_nascimento: new Date('2000-01-01'), telefone: '1', endereco: 'Rua A', documento: '1' };
    const userPesqResponse = await request(app).post('/api/v1/usuarios').send(userPesquisadorData);
    expect(userPesqResponse.status).toBe(201); // Garante que o usuário foi criado

    const loginPesq = await request(app).post('/api/v1/usuarios/login').send({ email: userPesquisadorData.email, senha: userPesquisadorData.senha });
    expect(loginPesq.status).toBe(200); // Garante que o login funcionou
    tokenPesquisador = loginPesq.body.token;
    const usuarioPesquisador: Usuario = loginPesq.body.user;

    const respPesq = await request(app).post('/api/v1/pesquisadores').set('Authorization', `Bearer ${tokenPesquisador}`).send({ nomeFicticio: 'P', usuarioId: usuarioPesquisador.id });
    expect(respPesq.status).toBe(201);
    pesquisadorDeTeste = respPesq.body;
    
    const respEstudo = await request(app).post('/api/v1/estudos').set('Authorization', `Bearer ${tokenPesquisador}`).send({ titulo: 'E', pesquisadorId: pesquisadorDeTeste.id, codigoRegistro: 'E', status: 'A', dataInicio: new Date(), dataFim: new Date(), informacoesGerais: 'I' });
    expect(respEstudo.status).toBe(201);
    const estudoDeTeste = respEstudo.body;
    
    const respForm = await request(app).post('/api/v1/formularios').set('Authorization', `Bearer ${tokenPesquisador}`).send({ titulo: 'F', estudoId: estudoDeTeste.id, texto_para_resposta_livre: 'T', data_criacao: new Date() });
    expect(respForm.status).toBe(201);
    const formDeTeste = respForm.body;
    
    const respQuestao = await request(app).post('/api/v1/questoes').set('Authorization', `Bearer ${tokenPesquisador}`).send({ texto: 'Q?', tipo: 'texto', obrigatorio: true, formularioId: formDeTeste.id });
    expect(respQuestao.status).toBe(201);
    questaoDeTeste = respQuestao.body;

    const respBusca = await request(app).post('/api/v1/buscas').set('Authorization', `Bearer ${tokenPesquisador}`).send({ nome: 'B', pesquisadorId: pesquisadorDeTeste.id });
    expect(respBusca.status).toBe(201);
    buscaDeTeste = respBusca.body;

    // --- Setup do Voluntário (com validações) ---
    const userVoluntarioData = { nome: 'Vol', sobrenome: 'Resp', email: 'vol.resp@exemplo.com', login: 'volresp', senha: 'senhaForte123', tipo: 'USER', tipo_especifico: 'VOLUNTARIO', sexo: 'FEMININO', data_nascimento: new Date('2000-01-01'), telefone: '2', endereco: 'Rua B', documento: '2' };
    const userVolResponse = await request(app).post('/api/v1/usuarios').send(userVoluntarioData);
    expect(userVolResponse.status).toBe(201);

    const loginVol = await request(app).post('/api/v1/usuarios/login').send({ email: userVoluntarioData.email, senha: userVoluntarioData.senha });
    expect(loginVol.status).toBe(200);
    tokenVoluntario = loginVol.body.token;
    const usuarioVoluntario: Usuario = loginVol.body.user;

    const respVol = await request(app).post('/api/v1/voluntarios').set('Authorization', `Bearer ${tokenVoluntario}`).send({ nomeFicticio: 'V', distancia: 15, usuarioId: usuarioVoluntario.id });
    expect(respVol.status).toBe(201);
    voluntarioDeTeste = respVol.body;
  });

  // O afterAll agora é gerenciado pelo jest.setup.ts, então podemos remover daqui.

  describe('POST /api/v1/respostas', () => {
    it('deve criar uma nova resposta e retornar status 201 se autenticado como voluntário', async () => {
      const dadosResposta = {
        voluntarioId: voluntarioDeTeste.id,
        busca_id: buscaDeTeste.id,
        questaoId: questaoDeTeste.id,
        conteudo: 'Uma resposta muito bem pensada.',
        marcado: false,
      };

      const resposta = await request(app)
        .post('/api/v1/respostas')
        .set('Authorization', `Bearer ${tokenVoluntario}`) // Usa o token do voluntário
        .send(dadosResposta);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.conteudo).toBe(dadosResposta.conteudo);
    });

    it('deve retornar status 401 se não estiver autenticado', async () => {
      const dadosResposta = { voluntarioId: voluntarioDeTeste.id, busca_id: buscaDeTeste.id, questaoId: questaoDeTeste.id, conteudo: '...', marcado: false };
      const resposta = await request(app).post('/api/v1/respostas').send(dadosResposta);
      expect(resposta.status).toBe(401);
    });
  });
});
