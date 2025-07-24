const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const materiaRoutes = require('./routes/materia');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiaRoutes);

const PORT = process.env.PORT || 5000;

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI) // As opções antigas foram removidas
  .then(() => {
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('Falha ao conectar com o MongoDB:', err);
  });