import { Response } from 'express';
import { Server } from 'socket.io';

import pool from '../src/config/database';
import { MensagensController } from '../src/controllers/MensagemController';
import { RequestAutenticada } from '../src/middlewares/auth';
import { createMensagemSchema, listarMensagensSchema } from '../src/schemas/MensagemSchema';

jest.mock('../src/config/database', () => ({ __esModule: true, default: { query: jest.fn() } }));

const consulta = jest.mocked(pool.query);
const VOLUNTARIO = 7;
const PESQUISADOR = 3;
const ESTUDO = 42;

// Respostas do banco simulado, escolhidas pelo início do SQL executado
const banco = (opcoes: { match?: boolean; notificacaoPendente?: boolean } = {}) => {
  const { match = true, notificacaoPendente = false } = opcoes;
  consulta.mockImplementation((async (sql: string) => {
    const texto = sql.replace(/\s+/g, ' ').trim();
    if (texto.startsWith('SELECT 1 FROM candidatura')) return [match ? [{ 1: 1 }] : []];
    if (texto.startsWith('INSERT INTO mensagem')) return [{ insertId: 99 }];
    if (texto.startsWith('SELECT * FROM mensagem WHERE id')) return [[{ id: 99, conteudo: 'Olá' }]];
    if (texto.startsWith('SELECT public_title')) return [[{ public_title: 'Caminhada' }]];
    if (texto.startsWith('SELECT 1 FROM notificacoes')) return [notificacaoPendente ? [{ 1: 1 }] : []];
    if (texto.startsWith('SELECT * FROM mensagem')) return [[{ id: 1 }, { id: 2 }]];
    return [[]];
  }) as never);
};

const comandos = () => consulta.mock.calls.map(([sql]) => String(sql).replace(/\s+/g, ' ').trim());

const novoSocket = () => {
  const emit = jest.fn();
  const io = { to: jest.fn(() => ({ emit })) };
  return { io, emit };
};

const resposta = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

const requisicao = (usuarioId: number, dados: { body?: unknown; params?: unknown }) =>
  ({ usuario: { id: usuarioId, tipoEspecifico: 'VOLUNTARIO' }, ...dados }) as unknown as RequestAutenticada;

beforeEach(() => consulta.mockReset());

describe('validação das mensagens', () => {
  it('aceita uma mensagem completa e rejeita conteúdo vazio ou longo demais', () => {
    expect(createMensagemSchema.safeParse({ leitorId: 3, estudoId: 42, conteudo: ' Olá ' }).success).toBe(
      true
    );
    expect(createMensagemSchema.safeParse({ leitorId: 3, estudoId: 42, conteudo: '   ' }).success).toBe(
      false
    );
    expect(
      createMensagemSchema.safeParse({ leitorId: 3, estudoId: 42, conteudo: 'a'.repeat(2001) }).success
    ).toBe(false);
    expect(createMensagemSchema.safeParse({ leitorId: -1, estudoId: 42, conteudo: 'Olá' }).success).toBe(
      false
    );
  });

  it('converte os parâmetros da rota de listagem em números', () => {
    expect(listarMensagensSchema.parse({ estudoId: '42', usuario1: '7', usuario2: '3' })).toEqual({
      estudoId: 42,
      usuario1: 7,
      usuario2: 3,
    });
  });
});

describe('envio de mensagem', () => {
  it('grava a mensagem do usuário autenticado, notifica o destinatário e entrega em tempo real', async () => {
    banco();
    const { io, emit } = novoSocket();
    const res = resposta();

    await new MensagensController(io as unknown as Server).create(
      requisicao(VOLUNTARIO, { body: { leitorId: PESQUISADOR, estudoId: ESTUDO, conteudo: 'Olá' } }),
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(201);
    const insercao = consulta.mock.calls.find(([sql]) => String(sql).includes('INSERT INTO mensagem'));
    expect(insercao?.[1]).toEqual([VOLUNTARIO, PESQUISADOR, ESTUDO, 'Olá']);
    expect(comandos().some((sql) => sql.startsWith('INSERT INTO notificacoes'))).toBe(true);
    expect(io.to).toHaveBeenCalledWith(`user-${PESQUISADOR}`);
    expect(io.to).toHaveBeenCalledWith(`user-${VOLUNTARIO}`);
    expect(emit).toHaveBeenCalledWith('nova-mensagem', { id: 99, conteudo: 'Olá' });
  });

  it('não repete a notificação enquanto a anterior da mesma conversa não for lida', async () => {
    banco({ notificacaoPendente: true });

    await new MensagensController(novoSocket().io as unknown as Server).create(
      requisicao(VOLUNTARIO, { body: { leitorId: PESQUISADOR, estudoId: ESTUDO, conteudo: 'Olá' } }),
      resposta() as unknown as Response
    );

    expect(comandos().some((sql) => sql.startsWith('INSERT INTO notificacoes'))).toBe(false);
  });

  it('recusa a mensagem quando não há match confirmado no estudo', async () => {
    banco({ match: false });
    const { io, emit } = novoSocket();
    const res = resposta();

    await new MensagensController(io as unknown as Server).create(
      requisicao(VOLUNTARIO, { body: { leitorId: PESQUISADOR, estudoId: ESTUDO, conteudo: 'Olá' } }),
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(comandos().some((sql) => sql.startsWith('INSERT'))).toBe(false);
    expect(emit).not.toHaveBeenCalled();
  });

  it('responde 400 para uma mensagem inválida sem consultar o banco', async () => {
    const res = resposta();

    await new MensagensController(novoSocket().io as unknown as Server).create(
      requisicao(VOLUNTARIO, { body: { leitorId: PESQUISADOR, estudoId: ESTUDO, conteudo: '' } }),
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(consulta).not.toHaveBeenCalled();
  });
});

describe('histórico da conversa', () => {
  const params = { estudoId: String(ESTUDO), usuario1: String(VOLUNTARIO), usuario2: String(PESQUISADOR) };

  it('devolve o histórico e registra a leitura das mensagens recebidas', async () => {
    banco();
    const res = resposta();

    await new MensagensController(novoSocket().io as unknown as Server).MensagesList(
      requisicao(VOLUNTARIO, { params }),
      res as unknown as Response
    );

    expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    const leitura = consulta.mock.calls.find(([sql]) =>
      String(sql).includes('UPDATE mensagem SET data_leitura')
    );
    expect(leitura?.[1]).toEqual([ESTUDO, VOLUNTARIO]);
  });

  it('impede que um usuário leia a conversa de outras pessoas', async () => {
    const res = resposta();

    await new MensagensController(novoSocket().io as unknown as Server).MensagesList(
      requisicao(55, { params }),
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(consulta).not.toHaveBeenCalled();
  });

  it('impede o acesso à conversa sem match confirmado', async () => {
    banco({ match: false });
    const res = resposta();

    await new MensagensController(novoSocket().io as unknown as Server).MensagesList(
      requisicao(VOLUNTARIO, { params }),
      res as unknown as Response
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(comandos().some((sql) => sql.startsWith('UPDATE'))).toBe(false);
  });
});
