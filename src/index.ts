import express, { Request, Response } from 'express';
import { config } from './config/env';
import MatchController from './controllers/MatchController';

const app = express();
app.use(express.json());

// Rota principal da aplicação
app.post('/generate-match', MatchController.handle);

// Rota de health-check para saber se a API está no ar
app.get('/', (req: Request, res: Response) => {
  res.send('API Orquestradora de Match está no ar!');
});

app.listen(config.port, () => {
  console.log(`Servidor Node.js/TypeScript rodando na porta ${config.port}`);
});