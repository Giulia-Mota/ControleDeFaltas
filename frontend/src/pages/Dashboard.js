import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
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
        if (!token) {
          navigate('/login');
          return;
        }

        // Verificar se o token é válido primeiro
        try {
          const userResponse = await api.get('/auth/me', {
            headers: { 'x-auth-token': token }
          });
          setUser(userResponse.data);
        } catch (authError) {
          console.error('Token inválido:', authError);
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        // Se chegou até aqui, o token é válido, então buscar matérias
        try {
          const materiasResponse = await api.get('/materias', {
            headers: { 'x-auth-token': token }
          });
          setMaterias(materiasResponse.data);
        } catch (materiasError) {
          console.error('Erro ao buscar matérias:', materiasError);
          setError('Não foi possível carregar as matérias.');
        }
      } catch (err) {
        console.error('Erro geral no dashboard:', err);
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

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-[#F5F5F5] p-6 rounded-2xl shadow-2xl text-center">
          <p className="text-lg text-gray-700">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#F5F5F5] p-6 rounded-2xl shadow-2xl">
        <header className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Bem-vindo, {user ? user.username : '...'}!
          </h1>
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <Link to="/cadastrar-materia" className="bg-purple-800 text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-purple-900 transition-colors text-sm">Adicionar Matéria</Link>
            <button onClick={handleLogout} className="bg-custom-red text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-custom-red-hover transition-colors text-sm">Sair</button>
          </div>
        </header>
        <main>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Minhas Matérias</h2>
          {error ? (
            <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
          ) : materias.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materias.map(materia => {
                  const faltasCount = materia.faltas.length;
                  const limiteFaltas = materia.limiteFaltas;
                  const percentual = limiteFaltas > 0 ? (faltasCount / limiteFaltas) * 100 : 0;
                  const percentualParaBarra = Math.min(percentual, 100);
                  let progressBarColor = 'bg-teal-500';
                  if (percentual >= 75) { progressBarColor = 'bg-custom-red'; } 
                  else if (percentual >= 50) { progressBarColor = 'bg-yellow-500'; }

                  return (
                    <Link to={`/materia/${materia._id}`} key={materia._id} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[140px]">
                      <div>
                        <h3 className="font-bold text-xl text-purple-800 truncate">{materia.nome}</h3>
                        <p className="text-gray-600 mt-1 text-sm">Professor(a): {materia.professor}</p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                          <span>Progresso de Faltas ({Math.floor(percentual)}%)</span>
                          <span>{faltasCount} / {limiteFaltas}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${progressBarColor} h-2 rounded-full`} style={{ width: `${percentualParaBarra}%` }}></div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
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