// frontend/src/api/axiosConfig.js

import axios from 'axios';

// A magia acontece aqui:
// 1. Procura a variável de ambiente REACT_APP_API_URL que vamos configurar no Render.
// 2. Se não encontrar (porque está rodando localmente), usa o endereço do seu backend local como padrão.
const baseURL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

// Debug: Log da URL que está sendo usada
console.log('🔧 Debug - API Configuration:');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('Base URL sendo usada:', baseURL);

const api = axios.create({
  baseURL: baseURL,
});

// Intercetor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    console.log('🚀 Request URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;