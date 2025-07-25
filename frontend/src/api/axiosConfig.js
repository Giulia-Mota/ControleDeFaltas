// frontend/src/services/api.js - CÓDIGO CORRIGIDO

import axios from 'axios';

// A linha mais importante: Ele lê a URL da API das variáveis de ambiente.
// Se não encontrar, ele usa 'http://localhost:5000' como um padrão para o ambiente local.
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log(`A API está configurada para: ${baseURL}`); // Ajuda a depurar

const api = axios.create({
  baseURL: baseURL
});

export default api;