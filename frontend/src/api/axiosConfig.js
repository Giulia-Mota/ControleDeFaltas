// frontend/src/api/axiosConfig.js

import axios from 'axios';

// A magia acontece aqui:
// 1. Procura a variável de ambiente REACT_APP_API_URL que vamos configurar no Render.
// 2. Se não encontrar (porque está rodando localmente), usa o endereço do seu backend local como padrão.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Intercetor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;