import { Router } from 'express';
import { FormularioController } from './formulario.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const formulariosRouter = Router();
const formularioController = new FormularioController();

formulariosRouter.post('/', authMiddleware, formularioController.create);
formulariosRouter.get('/', formularioController.findAll);
formulariosRouter.get('/:id', formularioController.findOne);
formulariosRouter.put('/:id', authMiddleware, formularioController.update);
formulariosRouter.delete('/:id', authMiddleware, formularioController.delete);

export { formulariosRouter };