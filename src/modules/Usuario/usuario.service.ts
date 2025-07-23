import { prisma } from '../../shared/config/prisma';
import { CreateUsuarioDto, LoginUsuarioDto } from './DTOs/usuario.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET: any = process.env.JWT_SECRET;

export class UsuarioService {
  async create(data: CreateUsuarioDto) {
    const emailExists = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (emailExists) {
      throw new Error('Email já está em uso.');
    }

    const loginExists = await prisma.usuario.findUnique({ where: { login: data.login } });
    if (loginExists) {
      throw new Error('Login já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(data.senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
    });

    const { senha, ...userWithoutPassword } = usuario;
    return userWithoutPassword;
  }

  async login({ email, senha }: LoginUsuarioDto) {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new Error('Email ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos.');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const { senha: _, ...userWithoutPassword } = usuario;

    return { user: userWithoutPassword, token };
  }

  async findAll() {
    return prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        tipo_especifico: true
      }
    });
  }

  async findOne(id: number) {
    const usuario = await prisma.usuario.findUnique({ 
        where: { id },
        select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            tipo_especifico: true
        }
    });
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
    return usuario;
  }

  async update(id: number, data: Partial<CreateUsuarioDto>) {
    const usuario = await prisma.usuario.update({
        where: { id },
        data,
        select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            tipo_especifico: true
        }
    });
    return usuario;
  }

  async delete(id: number) {
    await prisma.usuario.delete({ where: { id } });
  }
}