import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { MensagensController } from '../controllers/MensagemController';
import { authMiddleware } from '../middlewares/auth'; // Importe o middleware aqui

export function mensagemRouter(io: any) {
  const router = Router();
  const mensagensController = new MensagensController(io);

  router.post('/', authMiddleware, asyncHandler((req, res) => mensagensController.create(req, res)));
  
  router.get('/:estudoId/:usuario1/:usuario2', authMiddleware, asyncHandler((req, res) => mensagensController.MensagesList(req, res)));

  return router;
}