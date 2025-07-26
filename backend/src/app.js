// backend/src/app.js

// Deve ser a primeira linha para garantir que as variáveis de ambiente sejam carregadas
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware para interpretar o corpo das requisições como JSON
app.use(express.json());

// Configuração de CORS: Permite que apenas o seu frontend (definido na variável de ambiente) acesse a API.
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rota de teste para verificar se a API está no ar (ANTES da conexão com o banco)
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Teste de conexão',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      FRONTEND_URL: process.env.FRONTEND_URL,
      MONGO_URI: process.env.MONGO_URI ? 'Definida' : 'Não definida'
    }
  });
});

// Rota para testar se as rotas da API estão funcionando
app.get('/api-test', (req, res) => {
  res.json({ 
    message: 'Rota /api está funcionando',
    routes: ['/api/auth/login', '/api/auth/register', '/api/materias', '/api/faltas']
  });
});

// Conexão com o Banco de Dados MongoDB
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('ERRO FATAL: A variável de ambiente MONGO_URI não foi definida.');
  console.error('Variáveis de ambiente disponíveis:', Object.keys(process.env));
  // Não vamos mais encerrar o processo, apenas logar o erro
  console.log('Continuando sem conexão com o banco...');
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log('Conexão com o MongoDB estabelecida com sucesso!'))
    .catch(err => {
      console.error('FALHA AO CONECTAR COM O MONGODB:', err);
      console.log('Continuando sem conexão com o banco...');
    });
}

// --- SUAS ROTAS VÊM AQUI ---
console.log('🔄 Iniciando carregamento das rotas...');

try {
  console.log('📁 Carregando auth routes...');
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes carregadas');
  
  console.log('📁 Carregando falta routes...');
  const faltaRoutes = require('./routes/falta');
  console.log('✅ Falta routes carregadas');
  
  console.log('📁 Carregando materia routes...');
  const materiaRoutes = require('./routes/materia');
  console.log('✅ Materia routes carregadas');

  console.log('🔗 Registrando rotas...');
  app.use('/api/auth', authRoutes);
  console.log('✅ Rota /api/auth registrada');
  
  app.use('/api/faltas', faltaRoutes);
  console.log('✅ Rota /api/faltas registrada');
  
  app.use('/api/materias', materiaRoutes);
  console.log('✅ Rota /api/materias registrada');
  
  console.log('🎉 Todas as rotas carregadas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao carregar rotas:', error);
  console.error('Stack trace:', error.stack);
}

// --- FIM DAS ROTAS ---

// Servir arquivos estáticos do frontend (React build)
const buildPath = path.join(__dirname, '../../frontend/build');
app.use(express.static(buildPath));

// Fallback para SPA: serve index.html para qualquer rota que não seja API
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Inicialização do Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 URL do frontend configurada: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📋 Rotas disponíveis:`);
  console.log(`   - GET  /`);
  console.log(`   - GET  /test`);
  console.log(`   - GET  /api-test`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - GET  /api/materias`);
  console.log(`   - GET  /api/faltas`);
});