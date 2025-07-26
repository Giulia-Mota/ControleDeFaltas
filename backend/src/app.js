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
  origin: process.env.FRONTEND_URL, // Esta URL virá do Render
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Conexão com o Banco de Dados MongoDB
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('ERRO FATAL: A variável de ambiente MONGO_URI não foi definida.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('Conexão com o MongoDB estabelecida com sucesso!'))
  .catch(err => {
    console.error('FALHA AO CONECTAR COM O MONGODB:', err);
    process.exit(1);
  });

// --- ROTAS DA SUA APLICAÇÃO ---
// Suas rotas devem vir aqui. Exemplo:
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

// Rota de teste para verificar se a API está no ar
app.get('/api', (req, res) => {
  res.send('A API está no ar e funcionando!');
});

// --- FIM DAS ROTAS ---

// Inicialização do Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});