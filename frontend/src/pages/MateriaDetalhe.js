import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // ALTERAÇÃO IMPORTANTE
import { useParams, useNavigate, Link } from 'react-router-dom';

const MateriaDetalhe = () => {
  const { id } = useParams();
  const [materia, setMateria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMateria = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/materias/${id}`, { // USA O 'api'
          headers: { Authorization: `Bearer ${token}` }
        });
        setMateria(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes da matéria:", err);
        setError('Não foi possível carregar os detalhes da matéria.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMateria();
  }, [id]);

  const handleFalta = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/materias/${id}/falta`, { action }, { // USA O 'api'
        headers: { Authorization: `Bearer ${token}` }
      });
      setMateria(response.data);
    } catch (err) {
      console.error('Erro ao atualizar faltas:', err);
      setError('Não foi possível atualizar as faltas.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/materias/${id}`, { // USA O 'api'
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/dashboard');
      } catch (err) {
        console.error('Erro ao excluir matéria:', err);
        setError('Não foi possível excluir a matéria.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-[#F5F5F5] p-8 rounded-2xl shadow-2xl text-center">
          <p className="text-xl text-gray-700">Carregando matéria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#F5F5F5] p-8 rounded-2xl shadow-2xl">
        {materia && (
          <>
            <header className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{materia.nome}</h1>
                <p className="text-lg text-gray-600 mt-1">Professor(a): {materia.professor}</p>
              </div>
              <Link to="/dashboard" className="bg-gray-600 text-white text-center font-bold py-2 px-5 rounded-lg hover:bg-gray-700 transition-colors mt-4 md:mt-0">
                Voltar
              </Link>
            </header>
            <main>
              {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
              <div className="text-center bg-white p-6 rounded-lg shadow-inner mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Controle de Faltas</h2>
                <p className="text-6xl font-bold text-purple-800">{materia.faltas}
                  <span className="text-2xl font-normal text-gray-500"> / {materia.limiteFaltas}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Limite de Faltas em Dias</p>
              </div>
              <div className="flex justify-center items-center gap-4 mb-8">
                <button onClick={() => handleFalta('add')} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors text-lg">
                  + Adicionar Falta
                </button>
                <button onClick={() => handleFalta('remove')} className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors text-lg" disabled={materia.faltas <= 0}>
                  - Remover Falta
                </button>
              </div>
              <div className="mt-8 border-t border-gray-300 pt-6 text-center">
                <button onClick={handleDelete} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors">
                  Excluir Matéria
                </button>
              </div>
            </main>
          </>
        )}
         {error && !materia && <p className="text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default MateriaDetalhe;