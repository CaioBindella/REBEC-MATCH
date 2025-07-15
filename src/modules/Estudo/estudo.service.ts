import { prisma } from '../../shared/config/prisma';
import { CreateEstudoDto } from './DTOs/estudo.dto';

export class EstudoService {
  async create(data: CreateEstudoDto) {
    const pesquisadorExists = await prisma.pesquisador.findUnique({ where: { id: data.pesquisadorId } });
    if (!pesquisadorExists) {
      throw new Error('Pesquisador não encontrado.');
    }
    return prisma.estudo.create({ data });
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