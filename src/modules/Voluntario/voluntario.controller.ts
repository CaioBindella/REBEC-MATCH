import { Request, Response } from 'express';
import { VoluntarioService } from './voluntario.service';
import { createVoluntarioSchema } from './DTOs/voluntario.dto';

const voluntarioService = new VoluntarioService();

export class VoluntarioController {
  async create(req: Request, res: Response) {
    try { // Adicionar try catch
      const data = createVoluntarioSchema.parse(req.body);
      const voluntario = await voluntarioService.create(data);
      res.status(201).json(voluntario);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    const voluntarios = await voluntarioService.findAll();
    res.status(200).json(voluntarios);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const voluntario = await voluntarioService.findOne(Number(id));
    res.status(200).json(voluntario);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createVoluntarioSchema.partial().parse(req.body);
    const voluntario = await voluntarioService.update(Number(id), data);
    res.status(200).json(voluntario);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await voluntarioService.delete(Number(id));
    res.status(204).send();
  }
}