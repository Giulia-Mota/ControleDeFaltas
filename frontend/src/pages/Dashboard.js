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

        // Criar um timeout para evitar carregamento infinito
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );

        // Fazer as requisições em paralelo para otimizar
        const fetchPromises = Promise.all([
          api.get('/auth/me', {
            headers: { 'x-auth-token': token }
          }),
          api.get('/materias', {
            headers: { 'x-auth-token': token }
          })
        ]);

        // Race entre as requisições e o timeout
        const [userResponse, materiasResponse] = await Promise.race([
          fetchPromises,
          timeoutPromise
        ]);

        setUser(userResponse.data);
        setMaterias(materiasResponse.data);
        
      } catch (err) {
        console.error('Erro no dashboard:', err);
        
        if (err.message === 'Timeout') {
          setError('Tempo limite excedido. Verifique sua conexão.');
        } else if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        } else {
          setError('Não foi possível carregar os dados. Tente novamente.');
        }
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
        <div className="w-full max-w-sm bg-[#F5F5F5] p-4 rounded-2xl shadow-2xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <p className="text-base text-gray-700">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full bg-[#F5F5F5] p-4 rounded-2xl shadow-2xl" style={{ maxWidth: '600px' }}>
        <header className="flex items-center justify-between border-b border-gray-300 pb-3 mb-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Bem-vindo, {user ? user.username : '...'}!
          </h1>
          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/cadastrar-materia" className="bg-purple-800 text-white text-center font-bold py-1 px-2 md:py-1.5 md:px-3 rounded-lg hover:bg-purple-900 transition-colors text-xs">Adicionar Matéria</Link>
            <Link to="/calendario-faltas" className="bg-purple-800 text-white text-center font-bold py-1 px-2 md:py-1.5 md:px-3 rounded-lg hover:bg-purple-900 transition-colors text-xs">Calendário de Faltas</Link>
            <button onClick={handleLogout} className="bg-custom-red text-white text-center font-bold py-1 px-2 md:py-1.5 md:px-3 rounded-lg hover:bg-custom-red-hover transition-colors text-xs">Sair</button>
          </div>
        </header>
        <main>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Minhas Matérias</h2>
          {error ? (
            <p className="text-red-500 bg-red-100 p-2 rounded-md text-sm">{error}</p>
          ) : materias.length > 0 ? (
            <div className="max-h-[50vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {materias
                  .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
                  .map(materia => {
                  const faltasCount = materia.faltas.length;
                  const limiteFaltas = materia.limiteFaltas;
                  const percentual = limiteFaltas > 0 ? (faltasCount / limiteFaltas) * 100 : 0;
                  const percentualParaBarra = Math.min(percentual, 100);
                  let progressBarColor = 'bg-teal-500';
                  if (percentual >= 75) { progressBarColor = 'bg-custom-red'; } 
                  else if (percentual >= 50) { progressBarColor = 'bg-yellow-500'; }

                  return (
                    <div key={materia._id} className="relative bg-white p-3 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[100px] max-w-xs">
                      {/* Ícone de lixeira */}
                      <button
                        onClick={(e) => handleDeleteMateria(materia._id, materia.nome, e)}
                        className="absolute top-1 right-1 text-custom-red hover:text-custom-red-hover transition-colors p-1 rounded-full hover:bg-red-50"
                        title="Excluir matéria"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <Link to={`/materia/${materia._id}`} className="flex-1">
                        <div>
                          <h3 className="font-bold text-base text-purple-800 truncate">{materia.nome}</h3>
                          <p className="text-gray-600 mt-1 text-xs">Professor(a): {materia.professor}</p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                            <span>Progresso de Faltas ({Math.floor(percentual)}%)</span>
                            <span>{faltasCount} / {limiteFaltas}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`${progressBarColor} h-1.5 rounded-full`} style={{ width: `${percentualParaBarra}%` }}></div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-3 text-sm">Você ainda não cadastrou nenhuma matéria.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;