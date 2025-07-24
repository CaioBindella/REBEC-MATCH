import { Request, Response } from 'express';
import { EstudoService } from './estudo.service';
import { createEstudoSchema } from './DTOs/estudo.dto';

const estudoService = new EstudoService();

export class EstudoController {
  async create(req: Request, res: Response) {
    try{ // adicionar na dev
      const data = createEstudoSchema.parse(req.body);
      const estudo = await estudoService.create(data);
      res.status(201).json(estudo);
    }
    catch(error: any){
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    const estudos = await estudoService.findAll();
    res.status(200).json(estudos);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const estudo = await estudoService.findOne(Number(id));
    res.status(200).json(estudo);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createEstudoSchema.partial().parse(req.body);
    const estudo = await estudoService.update(Number(id), data);
    res.status(200).json(estudo);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await estudoService.delete(Number(id));
    res.status(204).send();
  }
}