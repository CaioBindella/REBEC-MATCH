import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import pool from '../src/config/database';
import { authMiddleware, autenticarToken, RequestAutenticada } from '../src/middlewares/auth';

jest.mock('../src/config/database', () => ({ __esModule: true, default: { query: jest.fn() } }));

const SEGREDO = 'segredo-de-teste-com-pelo-menos-32-caracteres';
const consulta = jest.mocked(pool.query);

const token = (opcoes: jwt.SignOptions = {}, segredo = SEGREDO) =>
  jwt.sign({}, segredo, {
    issuer: 'rebec-match-api',
    subject: 'voluntaria.teste',
    expiresIn: '1h',
    ...opcoes,
  });

beforeEach(() => {
  process.env.JWT_SECRET = SEGREDO;
  consulta.mockReset();
  consulta.mockResolvedValue([[{ id: 7, tipo_especifico: 'VOLUNTARIO' }], []] as never);
});

describe('autenticarToken', () => {
  it('identifica o usuário pelo login contido no token emitido pela API', async () => {
    await expect(autenticarToken(token())).resolves.toEqual({ id: 7, tipoEspecifico: 'VOLUNTARIO' });
    expect(consulta).toHaveBeenCalledWith(expect.stringContaining('WHERE login = ?'), ['voluntaria.teste']);
  });

  it('recusa tokens assinados com outro segredo, de outro emissor ou expirados', async () => {
    await expect(
      autenticarToken(token({}, 'outro-segredo-com-pelo-menos-32-caracteres'))
    ).resolves.toBeNull();
    await expect(autenticarToken(token({ issuer: 'outro-emissor' }))).resolves.toBeNull();
    await expect(autenticarToken(token({ expiresIn: -10 }))).resolves.toBeNull();
    expect(consulta).not.toHaveBeenCalled();
  });

  it('recusa quando o usuário não existe mais', async () => {
    consulta.mockResolvedValue([[], []] as never);
    await expect(autenticarToken(token())).resolves.toBeNull();
  });

  it('recusa quando não há token ou o segredo não está configurado', async () => {
    await expect(autenticarToken(undefined)).resolves.toBeNull();
    delete process.env.JWT_SECRET;
    await expect(autenticarToken(token())).resolves.toBeNull();
  });
});

describe('authMiddleware', () => {
  const resposta = () => {
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnValue(res);
    return res;
  };

  it('responde 401 quando o cabeçalho Authorization está ausente', async () => {
    const res = resposta();
    const next = jest.fn();

    await authMiddleware({ headers: {} } as Request, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('anexa o usuário autenticado à requisição e segue adiante', async () => {
    const req = { headers: { authorization: `Bearer ${token()}` } } as RequestAutenticada;
    const next = jest.fn();

    await authMiddleware(req, resposta() as unknown as Response, next);

    expect(req.usuario).toEqual({ id: 7, tipoEspecifico: 'VOLUNTARIO' });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
