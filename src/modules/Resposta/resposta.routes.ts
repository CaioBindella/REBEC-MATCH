import { Router } from 'express';
import { RespostaController } from './resposta.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const respostasRouter = Router();
const respostaController = new RespostaController();

respostasRouter.post('/', authMiddleware, respostaController.create);
respostasRouter.get('/', respostaController.findAll);
respostasRouter.get('/:id', respostaController.findOne);
respostasRouter.put('/:id', authMiddleware, respostaController.update);
respostasRouter.delete('/:id', authMiddleware, respostaController.delete);

export { respostasRouter };