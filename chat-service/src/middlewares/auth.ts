import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

// Mesmo emissor e segredo usados pela API principal (Java) ao gerar o token no login
const ISSUER = 'rebec-match-api';

export interface UsuarioAutenticado {
  id: number;
  tipoEspecifico: 'VOLUNTARIO' | 'PESQUISADOR';
}

export interface RequestAutenticada extends Request {
  usuario?: UsuarioAutenticado;
}

/**
 * Valida o JWT emitido pela API principal e identifica o usuário pelo login (subject do token).
 * Retorna null se o token for inválido, expirado ou se o usuário não existir mais.
 */
export async function autenticarToken(token: string | undefined): Promise<UsuarioAutenticado | null> {
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    return null;
  }
  try {
    const payload = jwt.verify(token, secret, { issuer: ISSUER }) as jwt.JwtPayload;
    if (!payload.sub) {
      return null;
    }
    const [rows]: any = await pool.query(
      'SELECT id, tipo_especifico FROM usuario WHERE login = ?',
      [payload.sub]
    );
    if (rows.length === 0) {
      return null;
    }
    return { id: rows[0].id, tipoEspecifico: rows[0].tipo_especifico };
  } catch {
    return null;
  }
}

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  const usuario = await autenticarToken(token);
  if (!usuario) {
    res.status(401).json({ message: 'Token ausente, inválido ou expirado.' });
    return;
  }
  (req as RequestAutenticada).usuario = usuario;
  next();
};
