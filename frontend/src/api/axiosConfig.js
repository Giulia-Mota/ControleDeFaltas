// frontend/src/api/axiosConfig.js - CÓDIGO CORRIGIDO

import axios from 'axios';

// AQUI ESTÁ A CORREÇÃO:
// 1. Ele tenta ler a URL da API a partir da variável de ambiente do Render.
// 2. Se não encontrar (porque está a rodar localmente), ele usa 'http://localhost:5000' como alternativa.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Adiciona um intercetor para incluir o token em todos os pedidos
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