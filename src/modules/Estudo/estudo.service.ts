import { prisma } from '../../shared/config/prisma';
import { CreateEstudoDto } from './DTOs/estudo.dto';
import { Prisma } from '@prisma/client';

export class EstudoService {
  async create(data: CreateEstudoDto) {
  try {
    // Tenta criar o estudo diretamente. Apenas uma chamada ao banco.
    const novoEstudo = await prisma.estudo.create({
      data: data,
    });
    return novoEstudo;

  } catch (error) {
    // Verifica se o erro é um erro conhecido do Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {

      // P2002: Erro de violação de constraint ÚNICA (ex: título duplicado)
      if (error.code === 'P2002') {
        // O campo 'target' no erro do Prisma nos diz qual constraint falhou
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('titulo')) {
          throw new Error('Já existe um estudo com este título.');
        }
      }

      // P2003: Erro de violação de chave estrangeira (ex: pesquisadorId não existe)
      if (error.code === 'P2003') {
        const target = (error.meta?.field_name as string) || '';
        if (target.includes('pesquisadorId')) {
           throw new Error('Pesquisador não encontrado.');
        }
      }
    }
    // Se não for um erro conhecido do Prisma, ou for um erro inesperado,
    // apenas relance o erro original.
    throw error;
  }
}

  async findAll() {
    return prisma.estudo.findMany();
  }

  async findOne(id: number) {
    const estudo = await prisma.estudo.findUnique({ where: { id } });
    if (!estudo) {
      throw new Error('Estudo não encontrado.');
    }
    return estudo;
  }

  async update(id: number, data: Partial<CreateEstudoDto>) {
    return prisma.estudo.update({ where: { id }, data });
  }

  async delete(id: number) {
    await prisma.estudo.delete({ where: { id } });
  }
}