import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/userController';

const userRouter = Router();
const usersController = new UserController();

userRouter.post('/', usersController.register as unknown as RequestHandler);
userRouter.post('/login', usersController.login as unknown as RequestHandler);
// userRouter.get('/', usersController.list);
// userRouter.get('/:id', usersController.getById);
// userRouter.put('/:id', usersController.update);
// userRouter.delete('/:id', usersController.delete);

export { userRouter };