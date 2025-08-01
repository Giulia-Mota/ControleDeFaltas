// frontend/src/pages/MateriaDetalhe.js - APENAS A URL DA API FOI ALTERADA

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const MateriaDetalhe = () => {
  const { id } = useParams();
  const [materia, setMateria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataFalta, setDataFalta] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMateria = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/materias/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMateria(response.data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes da matéria.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMateria();
  }, [id]);

  const handleAddFalta = async () => {
    if (!dataFalta) {
      setError('Por favor, selecione uma data.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/materias/${id}/faltas`, { date: dataFalta }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMateria(response.data);
      setError('');
    } catch (err) {
      setError('Não foi possível adicionar a falta.');
    }
  };
  
  const handleRemoveFalta = async (faltaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/materias/${id}/faltas/${faltaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMateria(response.data);
    } catch (err) {
      setError('Não foi possível remover a falta.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#F5F5F5] p-4 rounded-2xl shadow-2xl text-center">
          <p className="text-base text-gray-700">Carregando matéria...</p>
        </div>
      </div>
    );
  }

  const faltasCount = materia ? materia.faltas.length : 0;
  const limiteFaltas = materia ? materia.limiteFaltas : 0;
  const percentual = limiteFaltas > 0 ? (faltasCount / limiteFaltas) * 100 : 0;
  const percentualParaBarra = Math.min(percentual, 100);
  let progressBarColor = 'bg-teal-500';
  if (percentual >= 75) { progressBarColor = 'bg-custom-red'; } 
  else if (percentual >= 50) { progressBarColor = 'bg-yellow-500'; }

  const faltasOrdenadas = materia ? 
    [...materia.faltas].sort((a, b) => new Date(a.date) - new Date(b.date)) 
    : [];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full bg-[#F5F5F5] p-4 rounded-2xl shadow-2xl" style={{ maxWidth: '480px' }}>
        {materia && (
          <>
            <header className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-3 mb-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">{materia.nome}</h1>
                <p className="text-sm text-gray-600 mt-1">Professor(a): {materia.professor}</p>
                {/* AQUI ESTÁ A CORREÇÃO: Mostra a carga horária apenas se ela existir */}
                {materia.cargaHoraria && (
                  <p className="text-xs text-gray-500 mt-1">Carga Horária: {materia.cargaHoraria} horas</p>
                )}
              </div>
              <button onClick={() => navigate('/dashboard')} className="bg-gray-600 text-white font-bold py-1.5 px-3 rounded-lg mt-2 md:mt-0 text-xs">
                Voltar
              </button>
            </header>
            <main>
              {error && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-3 text-sm">{error}</p>}
              
              <div className="bg-white p-3 rounded-lg shadow-inner mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base font-semibold text-gray-700">Progresso de Faltas</h2>
                  <span className="font-bold text-gray-800">{Math.floor(percentual)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${progressBarColor} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentualParaBarra}%` }}></div>
                </div>
                <p className="text-center text-lg font-bold text-purple-800 mt-2">
                  {faltasCount} / {limiteFaltas}
                  <span className="text-xs font-normal text-gray-500"> Faltas (dias)</span>
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-4 p-2 bg-gray-100 rounded-lg">
                <input 
                  type="date"
                  value={dataFalta}
                  onChange={(e) => setDataFalta(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg text-sm"
                />
                <button onClick={handleAddFalta} className="bg-purple-800 text-white font-bold py-1.5 px-3 rounded-lg hover:bg-purple-900 transition-colors text-xs">
                  + Adicionar Falta
                </button>
              </div>

              <div className="mt-4 border-t border-gray-300 pt-3">
                <h3 className="text-base font-semibold text-gray-700 mb-2">Datas das Faltas</h3>
                {faltasCount > 0 ? (
                  <ul className={`space-y-1 ${faltasCount > 3 ? 'max-h-32 overflow-y-auto pr-2' : ''}`}>
                    {faltasOrdenadas.map((falta) => (
                      <li key={falta._id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-700">{new Date(falta.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                        <button 
                          onClick={() => handleRemoveFalta(falta._id)} 
                          className="bg-custom-red text-white font-bold py-1 px-2 rounded-md hover:bg-custom-red-hover transition-colors text-xs"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center text-sm">Nenhuma falta registada.</p>
                )}
              </div>
              
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default MateriaDetalhe;