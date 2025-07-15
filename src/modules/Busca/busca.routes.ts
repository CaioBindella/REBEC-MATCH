import { Router } from 'express';
import { BuscaController } from './busca.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const buscasRouter = Router();
const buscaController = new BuscaController();

buscasRouter.post('/', authMiddleware, buscaController.create);
buscasRouter.get('/', buscaController.findAll);
buscasRouter.get('/:id', buscaController.findOne);
buscasRouter.put('/:id', authMiddleware, buscaController.update);
buscasRouter.delete('/:id', authMiddleware, buscaController.delete);

export { buscasRouter };