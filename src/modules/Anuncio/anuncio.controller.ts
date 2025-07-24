import { Request, Response } from 'express';
import { AnuncioService } from './anuncio.service';
import { createAnuncioSchema } from './DTOs/anuncio.dto';

const anuncioService = new AnuncioService();

export class AnuncioController {
  async create(req: Request, res: Response) {
    try {
      const data = createAnuncioSchema.parse(req.body);
      const anuncio = await anuncioService.create(data);
      res.status(201).json(anuncio);
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async findAll(req: Request, res: Response) {
    const anuncios = await anuncioService.findAll();
    res.status(200).json(anuncios);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const anuncio = await anuncioService.findOne(Number(id));
    res.status(200).json(anuncio);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createAnuncioSchema.partial().parse(req.body);
    const anuncio = await anuncioService.update(Number(id), data);
    res.status(200).json(anuncio);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await anuncioService.delete(Number(id));
    res.status(204).send();
  }
}