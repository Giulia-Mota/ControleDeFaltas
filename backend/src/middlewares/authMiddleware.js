const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  let token = null;
  
  // Verifica se o token está no header Authorization (formato Bearer)
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  // Verifica se o token está no header x-auth-token (formato usado pelo frontend)
  if (!token) {
    token = req.header('x-auth-token');
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};