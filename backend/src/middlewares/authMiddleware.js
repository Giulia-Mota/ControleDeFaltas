const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  console.log('\n--- [authMiddleware] INICIADO ---');

  // 1. Verificar se o header de autorização existe
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.log('[authMiddleware] ERRO: Header "Authorization" não encontrado.');
    return res.status(401).json({ message: 'Acesso negado. Nenhum token no header.' });
  }
  console.log('[authMiddleware] Header "Authorization" encontrado:', authHeader);

  // 2. Verificar se o header está no formato correto "Bearer [token]"
  if (!authHeader.startsWith('Bearer ')) {
    console.log('[authMiddleware] ERRO: Formato do token inválido. Falta o "Bearer ".');
    return res.status(401).json({ message: 'Formato do token inválido.' });
  }

  try {
    // 3. Extrair o token
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('[authMiddleware] ERRO: Token está vazio após o "Bearer ".');
        return res.status(401).json({ message: 'Token não encontrado.' });
    }
    console.log('[authMiddleware] Token extraído com sucesso.');

    // 4. Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[authMiddleware] Token verificado com sucesso. Dados decodificados:', decoded);

    // 5. Anexar os dados do usuário ao pedido (req)
    req.user = decoded;
    console.log('[authMiddleware] Dados do usuário anexados a req.user.');

    // 6. Passar para a próxima função (o controller)
    console.log('[authMiddleware] A chamar next() para continuar para o controller...');
    console.log('--- [authMiddleware] FINALIZADO ---');
    next();

  } catch (error) {
    console.log('[authMiddleware] ERRO: Ocorreu uma exceção ao verificar o token.');
    console.error(error); // Imprime o erro detalhado
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};