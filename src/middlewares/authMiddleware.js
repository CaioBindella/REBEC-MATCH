const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1]; // Bearer token -> pega só o token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário no req para usar depois
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
