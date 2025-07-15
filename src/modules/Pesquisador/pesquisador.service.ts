import { prisma } from '../../shared/config/prisma';
import { CreatePesquisadorDto } from './DTOs/pesquisador.dto';

export class PesquisadorService {
  async create(data: CreatePesquisadorDto) {
    const usuarioExists = await prisma.usuario.findUnique({ where: { id: data.usuarioId } });
    if (!usuarioExists) {
      throw new Error('Usuário não encontrado.');
    }
    return prisma.pesquisador.create({ data });
  }

  async findAll() {
    return prisma.pesquisador.findMany();
  }

  async findOne(id: number) {
    const pesquisador = await prisma.pesquisador.findUnique({ where: { id } });
    if (!pesquisador) {
      throw new Error('Pesquisador não encontrado.');
    }
    return pesquisador;
  }

  async update(id: number, data: Partial<CreatePesquisadorDto>) {
    return prisma.pesquisador.update({ where: { id }, data });
  }

  async delete(id: number) {
    await prisma.pesquisador.delete({ where: { id } });
  }
}