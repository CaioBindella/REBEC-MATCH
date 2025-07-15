import { prisma } from '../../shared/config/prisma';
import { CreateVoluntarioDto } from './DTOs/voluntario.dto';

export class VoluntarioService {
  async create(data: CreateVoluntarioDto) {
    const usuarioExists = await prisma.usuario.findUnique({ where: { id: data.usuarioId } });
    if (!usuarioExists) {
      throw new Error('Usuário não encontrado.');
    }
    return prisma.voluntario.create({ data });
  }

  async findAll() {
    return prisma.voluntario.findMany();
  }

  async findOne(id: number) {
    const voluntario = await prisma.voluntario.findUnique({ where: { id } });
    if (!voluntario) {
      throw new Error('Voluntário não encontrado.');
    }
    return voluntario;
  }

  async update(id: number, data: Partial<CreateVoluntarioDto>) {
    return prisma.voluntario.update({ where: { id }, data });
  }

  async delete(id: number) {
    await prisma.voluntario.delete({ where: { id } });
  }
}