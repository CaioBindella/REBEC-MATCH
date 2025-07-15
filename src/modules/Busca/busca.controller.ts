import { Request, Response } from 'express';
import { BuscaService } from './busca.service';
import { createBuscaSchema } from './DTOs/busca.dto';

const buscaService = new BuscaService();

export class BuscaController {
  async create(req: Request, res: Response) {
    const data = createBuscaSchema.parse(req.body);
    const busca = await buscaService.create(data);
    res.status(201).json(busca);
  }

  async findAll(req: Request, res: Response) {
    const buscas = await buscaService.findAll();
    res.status(200).json(buscas);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const busca = await buscaService.findOne(Number(id));
    res.status(200).json(busca);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createBuscaSchema.partial().parse(req.body);
    const busca = await buscaService.update(Number(id), data);
    res.status(200).json(busca);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await buscaService.delete(Number(id));
    res.status(204).send();
  }
}