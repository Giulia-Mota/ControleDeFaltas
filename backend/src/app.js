require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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

app.get('/api-test', (req, res) => {
  res.json({ 
    message: 'Rota /api está funcionando',
    routes: ['/api/auth/login', '/api/auth/register', '/api/materias', '/api/faltas']
  });
});

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('ERRO: MONGO_URI não foi definida.');
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB conectado com sucesso!'))
    .catch(err => {
      console.error('Erro ao conectar com MongoDB:', err);
    });
}

try {
  const authRoutes = require('./routes/auth');
  const faltaRoutes = require('./routes/falta');
  const materiaRoutes = require('./routes/materia');

  app.use('/api/auth', authRoutes);
  app.use('/api/faltas', faltaRoutes);
  app.use('/api/materias', materiaRoutes);
} catch (error) {
  console.error('Erro ao carregar rotas:', error);
}

const buildPath = path.join(__dirname, '../../frontend/build');
app.use(express.static(buildPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});