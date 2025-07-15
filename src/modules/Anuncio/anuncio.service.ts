import { prisma } from '../../shared/config/prisma';
import { CreateAnuncioDto } from './DTOs/anuncio.dto';

export class AnuncioService {
  async create(data: CreateAnuncioDto) {
    const buscaExists = await prisma.busca.findUnique({ where: { id: data.buscaId } });
    if (!buscaExists) {
      throw new Error('Busca não encontrada.');
    }
    return prisma.anuncio.create({ data });
  }

  async findAll() {
    return prisma.anuncio.findMany();
  }

  async findOne(id: number) {
    const anuncio = await prisma.anuncio.findUnique({ where: { id } });
    if (!anuncio) {
      throw new Error('Anúncio não encontrado.');
    }
    return anuncio;
  }

  async update(id: number, data: Partial<CreateAnuncioDto>) {
    return prisma.anuncio.update({ where: { id }, data });
  }

  async delete(id: number) {
    await prisma.anuncio.delete({ where: { id } });
  }
}