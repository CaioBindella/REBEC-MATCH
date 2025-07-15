import { Router } from 'express';
import { VoluntarioController } from './voluntario.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const voluntariosRouter = Router();
const voluntarioController = new VoluntarioController();

voluntariosRouter.post('/', authMiddleware, voluntarioController.create);
voluntariosRouter.get('/', voluntarioController.findAll);
voluntariosRouter.get('/:id', voluntarioController.findOne);
voluntariosRouter.put('/:id', authMiddleware, voluntarioController.update);
voluntariosRouter.delete('/:id', authMiddleware, voluntarioController.delete);

export { voluntariosRouter };