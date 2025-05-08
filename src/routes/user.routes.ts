import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const userRouter = Router();
const usersController = new UserController();

userRouter.post('/', usersController.register);
userRouter.post('/login', usersController.login);
userRouter.get('/me', authMiddleware, usersController.getUser);
userRouter.put('/:id', authMiddleware, usersController.updateUser);
userRouter.delete('/:id', authMiddleware, usersController.deleteUser);
userRouter.get('/', authMiddleware, usersController.listUsers);



export { userRouter };