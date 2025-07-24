import { prisma } from '../../shared/config/prisma';
import { CreateEstudoDto } from './DTOs/estudo.dto';
import { Prisma } from '@prisma/client';

export class EstudoService {
  async create(data: CreateEstudoDto) {
    try {
      const novoEstudo = await prisma.estudo.create({
        data: data,
      });
      return novoEstudo;

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {

        if (error.code === 'P2002') {
          const target = (error.meta?.target as string[]) || [];
          if (target.includes('titulo')) {
            throw new Error('Já existe um estudo com este título.');
          }
        }
        // P2003: Erro de violação de chave estrangeira (pesquisadorId não existe)
        // Como o modelo Estudo só tem uma FK, um erro P2003 aqui significa
        // que o pesquisador não foi encontrado. Esta verificação é mais robusta.
        if (error.code === 'P2003') {
          throw new Error('Pesquisador não encontrado.');
        }
      }
      // Se não for um erro conhecido que tratamos, relance o erro original.
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