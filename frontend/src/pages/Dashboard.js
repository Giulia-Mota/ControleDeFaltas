import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // ALTERAÇÃO IMPORTANTE
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [userResponse, materiasResponse] = await Promise.all([
          api.get('/auth/me', config), // USA O 'api'
          api.get('/materias', config) // USA O 'api'
        ]);

        setUser(userResponse.data);
        setMaterias(materiasResponse.data);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError('Não foi possível carregar os dados.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) { /* ...código de carregamento... */ }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#F5F5F5] p-8 rounded-2xl shadow-2xl">
        <header className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Bem-vindo, {user ? user.username : '...'}!
          </h1>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link to="/cadastrar-materia" className="bg-[#9370DB] text-white text-center font-bold py-2 px-5 rounded-lg hover:bg-[#8A2BE2]">Adicionar Matéria</Link>
            <Link to="/relatorio-geral" className="bg-gray-600 text-white text-center font-bold py-2 px-5 rounded-lg hover:bg-gray-700">Relatório Geral</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white text-center font-bold py-2 px-5 rounded-lg hover:bg-red-600">Sair</button>
          </div>
        </header>
        <main>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Minhas Matérias</h2>
          {error ? <p className="text-red-500">{error}</p> : materias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materias.map(materia => (
                <Link to={`/materia/${materia._id}`} key={materia._id} className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                  <h3 className="font-bold text-xl text-purple-800 truncate">{materia.nome}</h3>
                  <p className="text-gray-600 mt-2">Professor(a): {materia.professor}</p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-lg font-semibold text-gray-800">Faltas: {materia.faltas}</p>
                    <p className="text-sm text-gray-500">Limite: {materia.limiteFaltas}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">Você ainda não cadastrou nenhuma matéria.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;