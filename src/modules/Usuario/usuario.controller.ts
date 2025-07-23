import { Request, Response } from 'express';
import { UsuarioService } from './usuario.service';
import { createUsuarioSchema, loginUsuarioSchema } from './DTOs/usuario.dto';

const usuarioService = new UsuarioService();

export class UsuarioController {
  async create(req: Request, res: Response) {
    try { // <--- Adicione o try
      const data = createUsuarioSchema.parse(req.body);
      const usuario = await usuarioService.create(data);
      res.status(201).json(usuario);
    } 
      catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    const data = loginUsuarioSchema.parse(req.body);
    const result = await usuarioService.login(data);
    res.status(200).json(result);
  }

  async findAll(req: Request, res: Response) {
    const usuarios = await usuarioService.findAll();
    res.status(200).json(usuarios);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const usuario = await usuarioService.findOne(Number(id));
    res.status(200).json(usuario);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createUsuarioSchema.partial().parse(req.body);
    const usuario = await usuarioService.update(Number(id), data);
    res.status(200).json(usuario);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await usuarioService.delete(Number(id));
    res.status(204).send();
  }
}