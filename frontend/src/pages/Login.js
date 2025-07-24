import React, { useState } from 'react';
import api from '../api/axiosConfig'; // ALTERAÇÃO IMPORTANTE
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores
    try {
      const response = await api.post('/auth/login', formData); // USA O 'api'
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro de login:', err);
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="p-8 max-w-md w-full bg-[#F5F5F5] rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <div className="mb-6">
            <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#9370DB] text-white p-3 rounded-lg mt-4 hover:bg-[#8A2BE2] transition-colors duration-300 font-bold text-lg"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-purple-700 hover:underline font-semibold">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;