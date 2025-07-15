import { Router } from 'express';
import { EstudoController } from './estudo.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const estudosRouter = Router();
const estudoController = new EstudoController();

estudosRouter.post('/', authMiddleware, estudoController.create);
estudosRouter.get('/', estudoController.findAll);
estudosRouter.get('/:id', estudoController.findOne);
estudosRouter.put('/:id', authMiddleware, estudoController.update);
estudosRouter.delete('/:id', authMiddleware, estudoController.delete);

export { estudosRouter };