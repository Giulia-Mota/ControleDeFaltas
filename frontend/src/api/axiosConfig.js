import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("INTERCEPTOR: Erro detectado!", error.response); // Log para vermos o erro
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;