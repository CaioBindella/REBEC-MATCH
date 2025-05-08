"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
const usersController = new userController_1.UserController();
userRouter.post('/', usersController.register);
userRouter.post('/login', usersController.login);
userRouter.get('/me', authMiddleware_1.default, usersController.getUser);
userRouter.put('/:id', authMiddleware_1.default, usersController.updateUser);
userRouter.delete('/:id', authMiddleware_1.default, usersController.deleteUser);
userRouter.get('/', authMiddleware_1.default, usersController.listUsers);
