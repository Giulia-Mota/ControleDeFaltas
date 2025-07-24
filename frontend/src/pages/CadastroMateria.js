import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const CadastroMateria = () => {
  const [formData, setFormData] = useState({
    nome: '',
    professor: '',
    cargaHoraria: '',
    aulasPorDia: '',
    aulasPorSemana: '',
  });

  const [limiteEmDias, setLimiteEmDias] = useState(0);
  const [limiteEmHoras, setLimiteEmHoras] = useState(0);
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
    try {
      const token = localStorage.getItem('token');
      const dadosParaEnviar = {
        nome: formData.nome,
        professor: formData.professor,
        limiteFaltas: limiteEmDias,
      };

      await api.post('/materias', dadosParaEnviar, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Erro ao cadastrar matéria:", err);
      setError('Não foi possível cadastrar a matéria. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#F5F5F5] p-8 rounded-2xl shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Cadastrar Matéria</h1>
            <Link to="/dashboard" className="bg-gray-600 text-white text-center font-bold py-2 px-5 rounded-lg hover:bg-gray-700 transition-colors">
                Voltar
            </Link>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            <div className="mb-6">
              <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="nome">Nome da Matéria</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Engenharia de Software II" className="w-full p-3 bg-white border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="professor">Nome do Professor(a)</label>
              <input type="text" name="professor" value={formData.professor} onChange={handleChange} placeholder="Ex: João da Silva" className="w-full p-3 bg-white border border-gray-300 rounded-md" required />
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="cargaHoraria">Carga Horária Total</label>
                <input type="number" name="cargaHoraria" value={formData.cargaHoraria} onChange={handleChange} placeholder="Ex: 68" className="w-full p-3 bg-white border border-gray-300 rounded-md" required min="1" />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="aulasPorDia">Aulas por Dia</label>
                <input type="number" name="aulasPorDia" value={formData.aulasPorDia} onChange={handleChange} placeholder="Ex: 2" className="w-full p-3 bg-white border border-gray-300 rounded-md" required min="1" />
              </div>
              <div>
                <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="aulasPorSemana">Aulas por Semana</label>
                <input type="number" name="aulasPorSemana" value={formData.aulasPorSemana} onChange={handleChange} placeholder="Ex: 2" className="w-full p-3 bg-white border border-gray-300 rounded-md" required min="1" />
              </div>
            </div>
            <div className="mb-8 p-4 bg-purple-100 border border-purple-300 rounded-lg text-center">
              <p className="text-gray-700">Com base nestes dados, você pode faltar no máximo:</p>
              <p className="text-3xl font-bold text-purple-800 mt-1">{limiteEmDias} dias</p>
              <p className="text-sm text-gray-500 mt-1">(Total de {limiteEmHoras} horas de falta permitidas)</p>
            </div>
            <button type="submit" className="w-full bg-[#9370DB] text-white p-3 rounded-lg mt-4 hover:bg-[#8A2BE2] transition-colors duration-300 font-bold text-lg">
              Salvar Matéria
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CadastroMateria;