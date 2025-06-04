"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensagemRouter = mensagemRouter;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const MensagemController_1 = require("../controllers/MensagemController");
function mensagemRouter(io) {
    const router = (0, express_1.Router)();
    const mensagensController = new MensagemController_1.MensagensController(io);
    router.post('/', (0, express_async_handler_1.default)((req, res) => mensagensController.create(req, res)));
    router.get('/:usuario1/:usuario2', (0, express_async_handler_1.default)((req, res) => mensagensController.MensagesList(req, res)));
    return router;
}
