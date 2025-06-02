import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { MensagensController } from '../controllers/MensagemController';

export function mensagemRouter(io: any) {
  const router = Router();
  const mensagensController = new MensagensController(io);

  router.post('/', asyncHandler((req, res) => mensagensController.create(req, res)));
  router.get('/:usuario1/:usuario2', asyncHandler((req, res) => mensagensController.MensagesList(req, res)));

  return router;
}
