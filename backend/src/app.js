// Substitua todo o conteúdo do seu arquivo backend/src/app.js por este código.

require('dotenv').config(); // Garante que esta seja a PRIMEIRA linha

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware - A forma correta e moderna de usar o que o bodyParser fazia
app.use(express.json()); 

// Configuração do CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Conexão com o Banco de Dados
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('!!! ERRO: A variável de ambiente MONGO_URI não foi definida.');
  process.exit(1); // Encerra o processo se a URI não estiver disponível
}

mongoose.connect(mongoUri)
  .then(() => console.log('Conexão com o MongoDB estabelecida com sucesso!'))
  .catch(err => {
    console.error('!!! FALHA AO CONECTAR COM O MONGODB !!!', err);
    process.exit(1); // Encerra o processo em caso de falha na conexão
  });

// --- SUAS ROTAS VÊM AQUI ---
const authRoutes = require('./routes/auth');
const faltaRoutes = require('./routes/falta');
const materiaRoutes = require('./routes/materia');

app.use('/api/auth', authRoutes);
app.use('/api/faltas', faltaRoutes);
app.use('/api/materias', materiaRoutes);

app.get('/', (req, res) => {
  res.send('API do Controle de Faltas está funcionando!');
});

// --- FIM DAS ROTAS ---

// Inicialização do Servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});