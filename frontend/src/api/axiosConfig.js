// frontend/src/api/axiosConfig.js - VERSÃO FINAL E CORRETA

import axios from 'axios';

// 1. Tenta ler a URL da API a partir da variável de ambiente do Render.
// 2. Se não encontrar (porque está a rodar localmente), ele usa 'http://localhost:5000/api' como alternativa.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Adiciona um intercetor para incluir o token de autenticação em todos os pedidos
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