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

  const handleDeleteMateria = async (materiaId, materiaNome, e) => {
    e.preventDefault(); // Previne a navegação do Link
    if (window.confirm(`Tem certeza que deseja excluir a matéria "${materiaNome}"?`)) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/materias/${materiaId}`, {
          headers: { 'x-auth-token': token }
        });
        // Recarrega as matérias após excluir
        const materiasResponse = await api.get('/materias', {
          headers: { 'x-auth-token': token }
        });
        setMaterias(materiasResponse.data);
      } catch (err) {
        setError('Não foi possível excluir a matéria.');
      }
    }
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
      <div className="w-full bg-[#F5F5F5] p-6 rounded-2xl shadow-2xl" style={{ maxWidth: '600px' }}>
        <header className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Bem-vindo, {user ? user.username : '...'}!
          </h1>
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <Link to="/cadastrar-materia" className="bg-purple-800 text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-purple-900 transition-colors text-sm">Adicionar Matéria</Link>
            <Link to="/calendario-faltas" className="bg-purple-800 text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-purple-900 transition-colors text-sm">Calendário de Faltas</Link>
            <button onClick={handleLogout} className="bg-custom-red text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-custom-red-hover transition-colors text-sm">Sair</button>
          </div>
        </header>
        <main>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Minhas Matérias</h2>
          {error ? (
            <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
          ) : materias.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {materias.map(materia => {
                  const faltasCount = materia.faltas.length;
                  const limiteFaltas = materia.limiteFaltas;
                  const percentual = limiteFaltas > 0 ? (faltasCount / limiteFaltas) * 100 : 0;
                  const percentualParaBarra = Math.min(percentual, 100);
                  let progressBarColor = 'bg-teal-500';
                  if (percentual >= 75) { progressBarColor = 'bg-custom-red'; } 
                  else if (percentual >= 50) { progressBarColor = 'bg-yellow-500'; }

                  return (
                    <div key={materia._id} className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[120px] max-w-xs">
                      {/* Ícone de lixeira */}
                      <button
                        onClick={(e) => handleDeleteMateria(materia._id, materia.nome, e)}
                        className="absolute top-2 right-2 text-custom-red hover:text-custom-red-hover transition-colors p-1 rounded-full hover:bg-red-50"
                        title="Excluir matéria"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <Link to={`/materia/${materia._id}`} className="flex-1">
                        <div>
                          <h3 className="font-bold text-lg text-purple-800 truncate">{materia.nome}</h3>
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
                    </div>
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