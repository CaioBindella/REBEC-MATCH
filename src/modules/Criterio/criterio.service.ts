import { prisma } from '../../shared/config/prisma';
import { CreateCriterioDto } from './DTOs/criterio.dto';

export class CriterioService {
  async create(data: CreateCriterioDto) {
    const buscaExists = await prisma.busca.findUnique({ where: { id: data.buscaId } });
    if (!buscaExists) {
      throw new Error('Busca não encontrada.');
    }
    return prisma.criterio.create({ data });
  }

  async findAll() {
    return prisma.criterio.findMany();
  }

  async findOne(id: number) {
    const criterio = await prisma.criterio.findUnique({ where: { id } });
    if (!criterio) {
      throw new Error('Critério não encontrado.');
    }
    return criterio;
  }

  async update(id: number, data: Partial<CreateCriterioDto>) {
    return prisma.criterio.update({ where: { id }, data });
  }

  async delete(id: number) {
    await prisma.criterio.delete({ where: { id } });
  }
}