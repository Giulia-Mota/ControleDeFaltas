import axios from 'axios';

// Cria uma instância "inteligente" do Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL base para todas as chamadas
});

// Este é o "guarda-costas" que inspeciona as respostas
api.interceptors.response.use(
  // Se a resposta for bem-sucedida, não faz nada
  (response) => response,
  // Se a resposta der erro...
  (error) => {
    // Verifica se o erro é de "Não Autorizado" (sessão expirada)
    if (error.response && error.response.status === 401) {
      // Limpa o token antigo
      localStorage.removeItem('token');
      // Redireciona o usuário para a página de login
      window.location.href = '/login';
    }
    // Retorna o erro para que possa ser tratado localmente, se necessário
    return Promise.reject(error);
  }
);

export default api;