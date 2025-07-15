import { prisma } from '../../shared/config/prisma';
import { CreateQuestaoDto } from './DTOs/questao.dto';

export class QuestaoService {
  async create(data: CreateQuestaoDto) {
    const formularioExists = await prisma.formulario.findUnique({ where: { id: data.formularioId } });
    if (!formularioExists) {
      throw new Error('Formulário não encontrado.');
    }
    
    // O Prisma espera um `JsonValue` para o campo `opcoes`
    const opcoesJson = data.opcoes ? JSON.parse(JSON.stringify(data.opcoes)) : undefined;

    return prisma.questao.create({ 
        data: {
            ...data,
            opcoes: opcoesJson,
        } 
    });
  }

  async findAll() {
    return prisma.questao.findMany();
  }

  async findOne(id: number) {
    const questao = await prisma.questao.findUnique({ where: { id } });
    if (!questao) {
      throw new Error('Questão não encontrada.');
    }
    return questao;
  }

  async update(id: number, data: Partial<CreateQuestaoDto>) {
    const opcoesJson = data.opcoes ? JSON.parse(JSON.stringify(data.opcoes)) : undefined;
    return prisma.questao.update({ 
        where: { id }, 
        data: {
            ...data,
            opcoes: opcoesJson,
        } 
    });
  }

  async delete(id: number) {
    await prisma.questao.delete({ where: { id } });
  }
}