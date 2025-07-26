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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      console.error('Erro de registro:', err);
      if (err.response && err.response.data.error && err.response.data.error.code === 11000) {
        setError('Este email ou nome de usuário já está em uso.');
      } else {
        setError('Erro ao registrar. Verifique os dados e tente novamente.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* CARD DIMINUÍDO: padding p-6 e max-w-md */}
      <div className="p-6 max-w-md w-full bg-[#F5F5F5] rounded-2xl shadow-2xl">
        {/* FONTE DO TÍTULO DIMINUÍDA: text-4xl */}
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Cadastro</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <div className="mb-4">
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
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>
          <div className="mb-4">
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
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>
          <div className="mb-6">
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
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>
          {/* COR DO BOTÃO ALTERADA */}
          <button
            type="submit"
            className="w-full bg-purple-800 text-white p-2 rounded-lg mt-4 hover:bg-purple-900 transition-colors duration-300 font-bold text-base"
          >
            Cadastrar
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Já tem uma conta?{' '}
          {/* COR DO LINK ALTERADA */}
          <Link to="/login" className="text-purple-800 hover:underline font-semibold">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;