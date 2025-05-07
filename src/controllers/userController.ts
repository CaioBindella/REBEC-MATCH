import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
}

const JWT_SECRET = process.env.JWT_SECRET as string;

const registerSchema = z.object({
    nome: z.string().min(1).max(50),
    sobrenome: z.string().min(1).max(50),
    login: z.string().min(1).max(50),
    email: z.string().email().min(1).max(100),
    senha: z.string().min(8).max(50),
    tipo: z.enum(['ADMIN', 'USER']),
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

    async register(req: Request, res: Response) {
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }

        const { nome, 
                sobrenome, 
                login, 
                email, 
                senha, 
                tipo, 
                sexo, 
                data_nascimento, 
                telefone, 
                endereco, 
                documento, 
                tester } = registerSchema.parse(req.body);
                
            const checkEmailQuery = await prisma.usuario.findUnique({
                where: { email }
            });
        
            if (checkEmailQuery) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            const hashedPassword = await bcrypt.hash(senha, 10);

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
                    tester
                }
            });

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(201).json({ user, token });
    }

    async login(req: Request, res: Response) {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }

        const { login, senha } = loginSchema.parse(req.body);

        const user = await prisma.usuario.findUnique({
            where: { login }
        });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        const token = jwt.sign({ id: user.id, login: user.login, email: user.email, tipo: user.tipo }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ user, token });
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout realizado com sucesso' });
    }

    async getUser(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.usuario.findUnique({
            where: { id: (decoded as { id: string }).id }
        });

        return res.status(200).json({ user });
    }

    async updateUser(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.usuario.findUnique({
            where: { id: (decoded as { id: string }).id }
        });

        return res.status(200).json({ user });
    }

    async deleteUser(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.usuario.findUnique({
            where: { id: (decoded as { id: string }).id }
        });

        return res.status(200).json({ user });
        await prisma.usuario.delete({
            where: { id: (decoded as { id: string }).id }
        });

        return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    }
    
}

