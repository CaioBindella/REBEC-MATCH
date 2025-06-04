"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
const mensagens_route_1 = require("./routes/mensagens.route");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: '*' }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rota para mensagens
app.use('/mensagens', (0, mensagens_route_1.mensagemRouter)(io));
app.get('/', (req, res) => {
    res.send('Chat Service is running!');
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Chat service rodando na porta ${PORT}`);
});
