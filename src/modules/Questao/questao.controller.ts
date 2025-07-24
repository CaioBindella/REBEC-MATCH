import { Request, Response } from 'express';
import { QuestaoService } from './questao.service';
import { createQuestaoSchema } from './DTOs/questao.dto';

const questaoService = new QuestaoService();

export class QuestaoController {
  async create(req: Request, res: Response) {
    try {
      const data = createQuestaoSchema.parse(req.body);
      const questao = await questaoService.create(data);
      res.status(201).json(questao);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    const questoes = await questaoService.findAll();
    res.status(200).json(questoes);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const questao = await questaoService.findOne(Number(id));
    res.status(200).json(questao);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createQuestaoSchema.partial().parse(req.body);
    const questao = await questaoService.update(Number(id), data);
    res.status(200).json(questao);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await questaoService.delete(Number(id));
    res.status(204).send();
  }
}