require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.error('Erro ao conectar no MongoDB:', err));

// Rotas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const materiaRoutes = require('./routes/materia');
app.use('/api/materias', materiaRoutes);

const faltaRoutes = require('./routes/falta');
app.use('/api/faltas', faltaRoutes);

// Rotas de exemplo
app.get('/', (req, res) => {
  res.send('API Controle de Faltas rodando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 