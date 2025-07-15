import { prisma } from '../../shared/config/prisma';
import { CreateBuscaDto } from './DTOs/busca.dto';

export class BuscaService {
  async create(data: CreateBuscaDto) {
    const pesquisadorExists = await prisma.pesquisador.findUnique({ where: { id: data.pesquisadorId } });
    if (!pesquisadorExists) {
      throw new Error('Pesquisador não encontrado.');
    }
    return prisma.busca.create({ data });
  }

  async findAll() {
    return prisma.busca.findMany();
  }

  async findOne(id: number) {
    const busca = await prisma.busca.findUnique({ where: { id } });
    if (!busca) {
      throw new Error('Busca não encontrada.');
    }
    return busca;
  }

  async update(id: number, data: Partial<CreateBuscaDto>) {
    return prisma.busca.update({ where: { id }, data });
  }

  async delete(id: number) {
    await prisma.busca.delete({ where: { id } });
  }
}