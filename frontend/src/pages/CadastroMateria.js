import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const CadastroMateria = () => {
  const [formData, setFormData] = useState({
    nome: '',
    professor: '',
    cargaHoraria: '',
    aulasPorDia: '',
  });

  const [limiteEmDias, setLimiteEmDias] = useState(0);
  const [limiteEmHoras, setLimiteEmHoras] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const carga = parseInt(formData.cargaHoraria, 10);
    const aulasDia = parseInt(formData.aulasPorDia, 10);

    if (carga > 0 && aulasDia > 0) {
      const limiteTotalHoras = Math.floor(carga * 0.25);
      setLimiteEmHoras(limiteTotalHoras);
      const limiteTotalDias = Math.floor(limiteTotalHoras / aulasDia);
      setLimiteEmDias(limiteTotalDias);
    } else {
      setLimiteEmDias(0);
      setLimiteEmHoras(0);
    }
  }, [formData.cargaHoraria, formData.aulasPorDia]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const dadosParaEnviar = {
        nome: formData.nome,
        professor: formData.professor,
        limiteFaltas: limiteEmDias,
        // AQUI ESTÁ A ALTERAÇÃO: Enviamos a cargaHoraria para o backend
        cargaHoraria: parseInt(formData.cargaHoraria, 10),
        aulasPorDia: parseInt(formData.aulasPorDia, 10),
      };

      await api.post('/materias', dadosParaEnviar, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/dashboard');

    } catch (err) {
      console.error("ERRO DETALHADO AO SALVAR:", err);
      if (err.response) {
        setError(`Erro do servidor: ${err.response.data.message || 'Verifique os dados.'}`);
      } else {
        setError("Erro de rede: Não foi possível conectar ao servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full bg-[#F5F5F5] p-4 rounded-2xl shadow-2xl" style={{ maxWidth: '480px' }}>
        <header className="flex items-center justify-between border-b border-gray-300 pb-3 mb-3">
            <h1 className="text-xl font-bold text-gray-800">Cadastrar Matéria</h1>
            <Link to="/dashboard" className="bg-gray-600 text-white text-center font-bold py-1.5 px-3 rounded-lg hover:bg-gray-700 transition-colors text-xs">
                Voltar
            </Link>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg relative mb-3 text-sm" role="alert">{error}</div>}
            
            <div className="mb-3">
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="nome">Nome da Matéria</label>
              <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Engenharia de Software II" className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" required />
            </div>
            
            <div className="mb-3">
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="professor">Nome do Professor(a)</label>
              <input type="text" id="professor" name="professor" value={formData.professor} onChange={handleChange} placeholder="Ex: João da Silva" className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" required />
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="cargaHoraria">Carga Horária Total</label>
                <input type="number" id="cargaHoraria" name="cargaHoraria" value={formData.cargaHoraria} onChange={handleChange} placeholder="Ex: 68" className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" required min="1" />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="aulasPorDia">Aulas por Dia</label>
                <input type="number" id="aulasPorDia" name="aulasPorDia" value={formData.aulasPorDia} onChange={handleChange} placeholder="Ex: 2" className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" required min="1" />
              </div>
            </div>

            <div className="mb-4 p-2 bg-purple-100 border border-purple-300 rounded-lg text-center">
              <p className="text-gray-700 text-xs">Com base nestes dados, você pode faltar no máximo:</p>
              <p className="text-xl font-bold text-purple-800 mt-1">{limiteEmDias} dias</p>
              <p className="text-xs text-gray-500 mt-1">(Total de {limiteEmHoras} horas de falta permitidas)</p>
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-800 text-white p-2 rounded-lg mt-3 hover:bg-purple-900 transition-colors duration-300 font-bold text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Matéria'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CadastroMateria;