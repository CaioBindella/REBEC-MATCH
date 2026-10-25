import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { mensagemRouter } from './routes/mensagens.route';
import { autenticarToken } from './middlewares/auth';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Defina JWT_SECRET (o mesmo valor de API_SECURITY_TOKEN_SECRET da API principal, mínimo de 32 caracteres).');
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Conexões em tempo real: o token é validado no handshake e o socket entra na sala do próprio usuário,
// para onde são emitidos os eventos 'nova-mensagem'.
io.use(async (socket, next) => {
  const usuario = await autenticarToken(socket.handshake.auth?.token);
  if (!usuario) {
    next(new Error('Token ausente, inválido ou expirado.'));
    return;
  }
  socket.data.usuarioId = usuario.id;
  next();
});

io.on('connection', (socket) => {
  socket.join(`user-${socket.data.usuarioId}`);
});

app.use(cors());
app.use(express.json());

app.use('/mensagens', mensagemRouter(io));

app.get('/', (req, res) => {
  res.send('Chat Service is running!');
});

// Erros não tratados (ex.: indisponibilidade do banco) retornam JSON padronizado
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro no serviço de chat:', err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Chat service rodando na porta ${PORT}`);
});
