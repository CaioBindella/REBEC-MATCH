import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './shared/middlewares/error.middleware';

// Importação das rotas
import { usuariosRouter } from './modules/Usuario/usuario.routes';
import { voluntariosRouter } from './modules/Voluntario/voluntario.routes';
import { pesquisadorRouter } from './modules/Pesquisador/pesquisador.routes';
import { estudosRouter } from './modules/Estudo/estudo.routes';
import { formulariosRouter } from './modules/Formulario/formulario.routes';
import { questoesRouter } from './modules/Questao/questao.routes';
import { respostasRouter } from './modules/Resposta/resposta.routes';
import { criteriosRouter } from './modules/Criterio/criterio.routes';
import { anunciosRouter } from './modules/Anuncio/anuncio.routes';
import { buscasRouter } from './modules/Busca/busca.routes';


const app = express();

app.use(cors());
app.use(express.json());

// Apenas em Produção, descomente a linha abaixo para habilitar o CORS
// Configuração do CORS
// Permite requisições de um domínio específico
// const corsOptions = {
//   credentials: true,
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
// };

// app.use(cors(corsOptions));

// Rota principal
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API do Rebec Match está rodando!' });
});

// Rotas da API
app.use('/api/v1/usuarios', usuariosRouter);
app.use('/api/v1/voluntarios', voluntariosRouter);
app.use('/api/v1/pesquisadores', pesquisadorRouter);
app.use('/api/v1/estudos', estudosRouter);
app.use('/api/v1/formularios', formulariosRouter);
app.use('/api/v1/questoes', questoesRouter);
app.use('/api/v1/respostas', respostasRouter);
app.use('/api/v1/criterios', criteriosRouter);
app.use('/api/v1/anuncios', anunciosRouter);
app.use('/api/v1/buscas', buscasRouter);

// Middleware de Erro
app.use(errorHandler);

export { app };