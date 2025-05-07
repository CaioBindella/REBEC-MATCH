import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/user.routes';
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/usuarios', userRouter);


// Error handling
// app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});