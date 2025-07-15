import { Router } from 'express';
import { CriterioController } from './criterio.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const criteriosRouter = Router();
const criterioController = new CriterioController();

criteriosRouter.post('/', authMiddleware, criterioController.create);
criteriosRouter.get('/', criterioController.findAll);
criteriosRouter.get('/:id', criterioController.findOne);
criteriosRouter.put('/:id', authMiddleware, criterioController.update);
criteriosRouter.delete('/:id', authMiddleware, criterioController.delete);

export { criteriosRouter };