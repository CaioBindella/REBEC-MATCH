import { Request, Response } from 'express';
import { CriterioService } from './criterio.service';
import { createCriterioSchema } from './DTOs/criterio.dto';

const criterioService = new CriterioService();

export class CriterioController {
  async create(req: Request, res: Response) {
    try {
      const data = createCriterioSchema.parse(req.body);
      const criterio = await criterioService.create(data);
      res.status(201).json(criterio);
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async findAll(req: Request, res: Response) {
    const criterios = await criterioService.findAll();
    res.status(200).json(criterios);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const criterio = await criterioService.findOne(Number(id));
    res.status(200).json(criterio);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createCriterioSchema.partial().parse(req.body);
    const criterio = await criterioService.update(Number(id), data);
    res.status(200).json(criterio);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await criterioService.delete(Number(id));
    res.status(204).send();
  }
}