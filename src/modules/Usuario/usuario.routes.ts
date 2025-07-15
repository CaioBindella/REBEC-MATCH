import { Router } from 'express';
import { UsuarioController } from './usuario.controller';
import authMiddleware from '../../shared/middlewares/auth.middleware';

const usuariosRouter = Router();
const usuarioController = new UsuarioController();

usuariosRouter.post('/', usuarioController.create);
usuariosRouter.post('/login', usuarioController.login);
usuariosRouter.get('/', authMiddleware, usuarioController.findAll);
usuariosRouter.get('/:id', authMiddleware, usuarioController.findOne);
usuariosRouter.put('/:id', authMiddleware, usuarioController.update);
usuariosRouter.delete('/:id', authMiddleware, usuarioController.delete);

export { usuariosRouter };