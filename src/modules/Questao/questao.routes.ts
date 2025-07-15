import { Router } from 'express';
import { QuestaoController } from './questao.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const questoesRouter = Router();
const questaoController = new QuestaoController();

questoesRouter.post('/', authMiddleware, questaoController.create);
questoesRouter.get('/', questaoController.findAll);
questoesRouter.get('/:id', questaoController.findOne);
questoesRouter.put('/:id', authMiddleware, questaoController.update);
questoesRouter.delete('/:id', authMiddleware, questaoController.delete);

export { questoesRouter };