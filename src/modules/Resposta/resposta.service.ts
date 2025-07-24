import { prisma } from '../../shared/config/prisma';
import { CreateRespostaDto } from './DTOs/resposta.dto';

export class RespostaService {
  async create(data: CreateRespostaDto) {
    // Valida a existência de todas as chaves estrangeiras de uma só vez
    const [voluntario, busca, questao] = await Promise.all([
      prisma.voluntario.findUnique({ where: { id: data.voluntarioId } }),
      prisma.busca.findUnique({ where: { id: data.busca_id } }),
      prisma.questao.findUnique({ where: { id: data.questaoId } }),
    ]);

    // Lança erros específicos se alguma entidade não for encontrada
    if (!voluntario) {
      throw new Error('Voluntário não encontrado.');
    }
    if (!busca) {
      throw new Error('Busca não encontrada.');
    }
    if (!questao) {
      throw new Error('Questão não encontrada.');
    }

    // Se tudo existir, cria a resposta
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