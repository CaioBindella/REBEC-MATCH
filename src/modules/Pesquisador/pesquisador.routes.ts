import { Router } from 'express';
import { PesquisadorController } from './pesquisador.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const pesquisadorRouter = Router();
const pesquisadorController = new PesquisadorController();

pesquisadorRouter.post('/', authMiddleware, pesquisadorController.create);
pesquisadorRouter.get('/', pesquisadorController.findAll);
pesquisadorRouter.get('/:id', pesquisadorController.findOne);
pesquisadorRouter.put('/:id', authMiddleware, pesquisadorController.update);
pesquisadorRouter.delete('/:id', authMiddleware, pesquisadorController.delete);

export { pesquisadorRouter };