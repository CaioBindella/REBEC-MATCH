import { prisma } from '../../shared/config/prisma';
import { CreateRespostaDto } from './DTOs/resposta.dto';

export class RespostaService {
  async create(data: CreateRespostaDto) {
    // Adicionar validações de existência se necessário (voluntario, busca, questao)
    return prisma.resposta.create({ data });
  }

  async findAll() {
    return prisma.resposta.findMany();
  }

  async findOne(id: number) {
    const resposta = await prisma.resposta.findUnique({ where: { id } });
    if (!resposta) {
      throw new Error('Resposta não encontrada.');
    }
    return resposta;
  }

  async update(id: number, data: Partial<CreateRespostaDto>) {
    return prisma.resposta.update({ where: { id }, data });
  }

  async delete(id: number) {
    await prisma.resposta.delete({ where: { id } });
  }
}