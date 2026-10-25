import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'match_v2',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});

// Teste de conexão
pool.getConnection()
  .then((conn) => {
    console.log('Conectado à Base de Dados MySQL');
    conn.release();
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MySQL:', err.message);
  });

export default pool;