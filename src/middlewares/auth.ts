import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET as string;
    
    const decoded = jwt.verify(token, secret);
    
    (req as any).user = decoded; 
    next(); // Passa para o Controller
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
    return;
  }
};