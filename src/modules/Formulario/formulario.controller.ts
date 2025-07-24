import { Request, Response } from 'express';
import { FormularioService } from './formulario.service';
import { createFormularioSchema } from './DTOs/formulario.dto';

const formularioService = new FormularioService();

export class FormularioController {
  async create(req: Request, res: Response) {
    try {
      const data = createFormularioSchema.parse(req.body);
      const formulario = await formularioService.create(data);
      res.status(201).json(formulario);
    } 
    catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    const formularios = await formularioService.findAll();
    res.status(200).json(formularios);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const formulario = await formularioService.findOne(Number(id));
    res.status(200).json(formulario);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createFormularioSchema.partial().parse(req.body);
    const formulario = await formularioService.update(Number(id), data);
    res.status(200).json(formulario);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await formularioService.delete(Number(id));
    res.status(204).send();
  }
}