import { Request, Response } from 'express';
import { PesquisadorService } from './pesquisador.service';
import { createPesquisadorSchema } from './DTOs/pesquisador.dto';

const pesquisadorService = new PesquisadorService();

export class PesquisadorController {
  async create(req: Request, res: Response) {
    try { // <-- Adicione o try
      const data = createPesquisadorSchema.parse(req.body);
      const pesquisador = await pesquisadorService.create(data);
      res.status(201).json(pesquisador);
    } catch (error: any) { // <-- Adicione o catch
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    const pesquisadores = await pesquisadorService.findAll();
    res.status(200).json(pesquisadores);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const pesquisador = await pesquisadorService.findOne(Number(id));
    res.status(200).json(pesquisador);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createPesquisadorSchema.partial().parse(req.body);
    const pesquisador = await pesquisadorService.update(Number(id), data);
    res.status(200).json(pesquisador);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await pesquisadorService.delete(Number(id));
    res.status(204).send();
  }
}