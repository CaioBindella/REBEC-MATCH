import { Request, Response } from 'express';
import { RespostaService } from './resposta.service';
import { createRespostaSchema } from './DTOs/resposta.dto';

const respostaService = new RespostaService();

export class RespostaController {
  async create(req: Request, res: Response) {
    try {
      const data = createRespostaSchema.parse(req.body);
      const resposta = await respostaService.create(data);
      res.status(201).json(resposta);
    } catch (error: any) {
      res.status(400).json({ message: error.mensage })
    }
  }

  async findAll(req: Request, res: Response) {
    const respostas = await respostaService.findAll();
    res.status(200).json(respostas);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const resposta = await respostaService.findOne(Number(id));
    res.status(200).json(resposta);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createRespostaSchema.partial().parse(req.body);
    const resposta = await respostaService.update(Number(id), data);
    res.status(200).json(resposta);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await respostaService.delete(Number(id));
    res.status(204).send();
  }
}