const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Garante que as variáveis de ambiente são lidas

const authRoutes = require('./routes/auth');
const materiaRoutes = require('./routes/materia');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(bodyParser.json());

// Rotas da aplicação
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiaRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI; // Usando MONGODB_URI como você confirmou

// --- LÓGICA DE CONEXÃO E INICIALIZAÇÃO CORRIGIDA ---

// 1. Verifica se a URI do MongoDB existe
if (!MONGO_URI) {
  console.error('ERRO CRÍTICO: A variável de ambiente MONGODB_URI não foi encontrada.');
  console.error('Por favor, verifique se o arquivo .env existe na pasta /backend e se a variável está definida corretamente.');
  process.exit(1); // Encerra o processo se não houver URI
}

// 2. Tenta conectar ao banco de dados
console.log('A tentar conectar ao MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('>>> Conexão com o MongoDB estabelecida com sucesso! <<<');
    // 3. Inicia o servidor APENAS se a conexão for bem-sucedida
    const PORT = process.env.PORT || 5000; // Usa a porta do .env ou 3001 como padrão
    app.listen(PORT, () => {console.log(`Servidor rodando na porta ${PORT}`);
});
  })
  .catch(err => {
    console.error('!!! FALHA AO CONECTAR COM O MONGODB !!!');
    console.error(err);
    process.exit(1); // Encerra o processo se a conexão falhar
  });