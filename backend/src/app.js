// backend/src/app.js

// Deve ser a primeira linha para garantir que as variáveis de ambiente sejam carregadas
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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
app.get('/', (req, res) => {
  res.send('API do Controle de Faltas está funcionando!');
});

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
try {
  const authRoutes = require('./routes/auth');
  const faltaRoutes = require('./routes/falta');
  const materiaRoutes = require('./routes/materia');

  app.use('/api/auth', authRoutes);
  app.use('/api/faltas', faltaRoutes);
  app.use('/api/materias', materiaRoutes);
  
  console.log('Rotas carregadas com sucesso!');
} catch (error) {
  console.error('Erro ao carregar rotas:', error);
}

// --- FIM DAS ROTAS ---

// Inicialização do Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL do frontend configurada: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});