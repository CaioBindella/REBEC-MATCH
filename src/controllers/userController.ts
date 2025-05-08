import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET!;
const registerSchema = z.object({
  nome: z.string().min(1).max(50),
  sobrenome: z.string().min(1).max(50),
  login: z.string().min(1).max(50),
  email: z.string().email().min(1).max(100),
  senha: z.string().min(8).max(50),
  tipo: z.enum(['ADMIN', 'USER']),
  tipo_especifico: z.enum(['PESQUISADOR', 'VOLUNTARIO']),
  sexo: z.enum(['MASCULINO', 'FEMININO']),
  data_nascimento: z.coerce.date(),
  telefone: z.string().min(1).max(25),
  endereco: z.string().min(1).max(255),
  documento: z.string().min(1).max(25),
  tester: z.boolean().optional(),
});

const loginSchema = z.object({
  login: z.string().min(1),
  senha: z.string().min(8),
});

export class UserController {
  async register(req: Request, res: Response): Promise<void> {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }

    const {
      nome, sobrenome, login, email, senha, tipo,
      tipo_especifico, sexo, data_nascimento, telefone,
      endereco, documento, tester
    } = result.data;

  // Verificar tester antes de criar o usuário
  if (typeof tester !== 'boolean') {
    res.status(400).json({ error: 'Campo "tester" deve ser booleano.' });
    return;
  }

  const existing = await prisma.usuario.findFirst({
    where: { OR: [{ email }, { login }] }
  });
  if (existing) {
    res.status(400).json({ message: 'Email ou login já cadastrado' });
    return;
  }

  const hashedPassword = await bcrypt.hash(senha, 10);
  
  try {
    const user = await prisma.usuario.create({
      data: {
        nome, 
        sobrenome, 
        login, 
        email,
        senha: hashedPassword, 
        tipo, 
        sexo,
        data_nascimento, 
        telefone, 
        endereco,
        documento, 
        tester,
        ...(tipo_especifico === 'PESQUISADOR' && { 
          pesquisador: { 
            create: {} // Pesquisador não tem campos obrigatórios
          } 
        }),
        ...(tipo_especifico === 'VOLUNTARIO' && { 
          voluntario: { 
            create: { 
              distancia: 0 // Campo obrigatório para Voluntario
            } 
          } 
        }),
      }
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao criar usuário' });
  }
}

  async login(req: Request, res: Response): Promise<void> {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }

    const { login, senha } = result.data;
    const user = await prisma.usuario.findUnique({ where: { login } });
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, login: user.login, email: user.email, tipo: user.tipo },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ user, token });
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const userId = (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    const user = await prisma.usuario.findUnique({ where: { id: userId } });
    res.status(200).json({ user });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.id);
    await prisma.usuario.update({ where: { id: userId }, data: req.body });
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.id);
    await prisma.usuario.delete({ where: { id: userId } });
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  }

  async listUsers(_req: Request, res: Response): Promise<void> {
    const users = await prisma.usuario.findMany();
    res.status(200).json({ users });
  }
}
