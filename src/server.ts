import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import 'dotenv/config';
import { mensagemRouter } from './routes/mensagens.route';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Rota para mensagens
app.use('/mensagens', mensagemRouter(io));

app.get('/', (req, res) => {
  res.send('Chat Service is running!');
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Chat service rodando na porta ${PORT}`);
});
