import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpa erro quando o usuário começa a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.username || !formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      console.error('Erro de registro:', err);
      let msg = 'Erro ao registrar. Verifique os dados e tente novamente.';
      if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="p-6 max-w-md w-full bg-[#F5F5F5] rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Cadastro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Nome de Usuário
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Seu nome de usuário"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Senha (mínimo 6 caracteres)
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg font-bold text-base transition-all duration-200 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-800 hover:bg-purple-900 hover:shadow-lg'
            } text-white`}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-purple-800 hover:underline font-semibold">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;