import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CadastroMateria() {
  const [form, setForm] = useState({
    nome: "",
    professor: "",
    cargaHoraria: "",
    aulasPorSemana: "",
    aulasPorDia: "",
  });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cálculo automático do limite de faltas em dias
  const limiteFaltasDias = useMemo(() => {
    const carga = Number(form.cargaHoraria);
    const aulasPorDia = Number(form.aulasPorDia);
    if (!carga || !aulasPorDia) return 0;
    const totalDias = carga / aulasPorDia;
    return Math.floor(totalDias * 0.25);
  }, [form.cargaHoraria, form.aulasPorDia]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/materias", {
        ...form,
        cargaHoraria: Number(form.cargaHoraria),
        aulasPorSemana: Number(form.aulasPorSemana),
        aulasPorDia: Number(form.aulasPorDia),
        limiteFaltas: limiteFaltasDias,
        horarios: [], // O usuário pode editar depois
        datasAulas: [], // O usuário pode editar depois
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao cadastrar matéria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-auto mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Cadastrar Nova Matéria</h2>
      {erro && <div className="mb-4 text-red-600 text-center">{erro}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nome da Matéria</label>
          <input name="nome" value={form.nome} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-gray-700">Professor</label>
          <input name="professor" value={form.professor} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700">Carga Horária (h)</label>
            <input name="cargaHoraria" type="number" min="1" value={form.cargaHoraria} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">Aulas por Semana</label>
            <input name="aulasPorSemana" type="number" min="1" value={form.aulasPorSemana} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700">Aulas por Dia</label>
            <input name="aulasPorDia" type="number" min="1" value={form.aulasPorDia} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <span className="block text-gray-700 font-semibold mt-6">Limite de faltas (dias): <span className="text-blue-700">{limiteFaltasDias}</span></span>
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
} 