import { Router } from 'express';
import { AnuncioController } from './anuncio.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const anunciosRouter = Router();
const anuncioController = new AnuncioController();

anunciosRouter.post('/', authMiddleware, anuncioController.create);
anunciosRouter.get('/', anuncioController.findAll);
anunciosRouter.get('/:id', anuncioController.findOne);
anunciosRouter.put('/:id', authMiddleware, anuncioController.update);
anunciosRouter.delete('/:id', authMiddleware, anuncioController.delete);

export { anunciosRouter };