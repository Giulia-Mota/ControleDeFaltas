import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // ALTERAÇÃO IMPORTANTE
import { Link } from 'react-router-dom';

const RelatorioGeral = () => {
  const [materias, setMaterias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterias = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/materias', { // USA O 'api'
          headers: { Authorization: `Bearer ${token}` }
        });
        setMaterias(response.data);
      } catch (err) {
        console.error("Erro ao buscar matérias:", err);
        setError('Não foi possível carregar o relatório.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterias();
  }, []);

  const materiasEmRisco = materias.filter(materia => {
    if (materia.limiteFaltas === 0) return false;
    const percentualFaltas = (materia.faltas / materia.limiteFaltas) * 100;
    return percentualFaltas >= 75;
  }).length;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#F5F5F5] p-8 rounded-2xl shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Relatório Geral</h1>
          <Link to="/dashboard" className="bg-gray-600 text-white text-center font-bold py-2 px-5 rounded-lg hover:bg-gray-700">
            Voltar ao Dashboard
          </Link>
        </header>
        <main>
          {isLoading ? (
            <p className="text-center text-gray-600">Carregando relatório...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div>
              <div className="mb-8">
                <div className="bg-red-100 text-red-800 p-6 rounded-lg text-center shadow">
                  <h2 className="text-xl font-bold">Matérias em Risco</h2>
                  <p className="text-5xl font-light mt-2">{materiasEmRisco}</p>
                  <p className="text-sm mt-2">(Com 75% ou mais do limite de faltas atingido)</p>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Detalhes por Matéria</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Matéria</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Professor</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Faltas</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Limite</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materias.map((materia) => {
                      const percentualFaltas = materia.limiteFaltas > 0 ? (materia.faltas / materia.limiteFaltas) * 100 : 0;
                      let statusCor = 'text-green-600';
                      let statusTexto = 'Seguro';
                      if (percentualFaltas >= 75) {
                        statusCor = 'text-red-600';
                        statusTexto = 'Crítico';
                      } else if (percentualFaltas >= 50) {
                        statusCor = 'text-yellow-600';
                        statusTexto = 'Atenção';
                      }
                      return (
                        <tr key={materia._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{materia.nome}</td>
                          <td className="py-3 px-4 text-gray-600">{materia.professor}</td>
                          <td className="py-3 px-4 text-center">{materia.faltas}</td>
                          <td className="py-3 px-4 text-center">{materia.limiteFaltas}</td>
                          <td className={`py-3 px-4 text-center font-bold ${statusCor}`}>
                            {statusTexto}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RelatorioGeral;