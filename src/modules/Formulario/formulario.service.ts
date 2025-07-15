import { prisma } from '../../shared/config/prisma';
import { CreateFormularioDto } from './DTOs/formulario.dto';

export class FormularioService {
  async create(data: CreateFormularioDto) {
    const estudoExists = await prisma.estudo.findUnique({ where: { id: data.estudoId } });
    if (!estudoExists) {
      throw new Error('Estudo não encontrado.');
    }
    return prisma.formulario.create({ data });
  }

  async findAll() {
    return prisma.formulario.findMany({ include: { questoes: true } });
  }

  async findOne(id: number) {
    const formulario = await prisma.formulario.findUnique({ 
        where: { id },
        include: { questoes: true } 
    });
    if (!formulario) {
      throw new Error('Formulário não encontrado.');
    }
    return formulario;
  }

  async update(id: number, data: Partial<CreateFormularioDto>) {
    return prisma.formulario.update({ where: { id }, data });
  }

  async delete(id: number) {
    await prisma.formulario.delete({ where: { id } });
  }
}