import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/materias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaterias(res.data);
      } catch (err) {
        setErro("Erro ao buscar matérias.");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-full max-w-3xl bg-creme rounded-2xl shadow-xl p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-primary-dark">Bem-vindo, {user?.nome || "usuário"}!</h2>
        <div className="flex gap-2">
          <button
            className="bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary transition"
            onClick={() => navigate("/materia/nova")}
          >
            + Nova Matéria
          </button>
          <button
            className="bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary transition"
            onClick={() => navigate("/relatorio")}
          >
            Relatório Geral
          </button>
          <button
            className="bg-red-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
      <p className="text-gray-700 mb-6">Suas matérias cadastradas:</p>
      {loading ? (
        <div className="text-center text-gray-500">Carregando...</div>
      ) : erro ? (
        <div className="text-red-600 text-center mb-4">{erro}</div>
      ) : (
        <ul className="space-y-4">
          {materias.length === 0 ? (
            <li className="text-gray-500">Nenhuma matéria cadastrada ainda.</li>
          ) : (
            materias.map((mat) => (
              <li
                key={mat._id}
                className="border border-primary-light bg-white rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-primary-light/20 transition shadow"
                onClick={() => navigate(`/materia/${mat._id}`)}
              >
                <div>
                  <span className="font-semibold text-primary-dark">{mat.nome}</span> <span className="text-gray-500">({mat.professor})</span>
                  <div className="text-sm text-gray-600">Carga horária: {mat.cargaHoraria}h | Limite de faltas: {mat.limiteFaltas}</div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
} 