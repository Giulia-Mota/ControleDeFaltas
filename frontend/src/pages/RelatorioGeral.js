import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RelatorioGeral() {
  const [relatorio, setRelatorio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/materias/relatorio/geral", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRelatorio(res.data);
      } catch {
        setErro("Erro ao buscar relatório.");
      } finally {
        setLoading(false);
      }
    };
    fetchRelatorio();
  }, []);

  const totalFaltas = relatorio.reduce((acc, mat) => acc + mat.totalFaltas, 0);
  const totalLimite = relatorio.reduce((acc, mat) => acc + mat.limiteFaltas, 0);
  const emRisco = relatorio.filter(mat => mat.emRisco);

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mx-auto mt-8">
      <button onClick={() => navigate("/dashboard")} className="mb-4 text-blue-600 hover:underline">← Voltar</button>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Relatório Geral</h2>
      {loading ? (
        <div className="text-center text-gray-500">Carregando...</div>
      ) : erro ? (
        <div className="text-red-600 text-center mb-4">{erro}</div>
      ) : (
        <>
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">Resumo</div>
            <div className="flex flex-wrap gap-4 mb-2">
              <div className="bg-blue-100 rounded-lg p-4 flex-1 min-w-[180px]">
                <div className="text-gray-700">Total de faltas</div>
                <div className="text-2xl font-bold text-blue-700">{totalFaltas}</div>
              </div>
              <div className="bg-blue-100 rounded-lg p-4 flex-1 min-w-[180px]">
                <div className="text-gray-700">Limite total</div>
                <div className="text-2xl font-bold text-blue-700">{totalLimite}</div>
              </div>
              <div className="bg-red-100 rounded-lg p-4 flex-1 min-w-[180px]">
                <div className="text-gray-700">Matérias em risco</div>
                <div className="text-2xl font-bold text-red-600">{emRisco.length}</div>
              </div>
            </div>
          </div>
          <div className="mb-4 text-lg font-semibold">Progresso por matéria</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatorio.map((mat) => (
              <div key={mat.materiaId} className={`rounded-lg p-4 shadow border ${mat.emRisco ? 'border-red-400 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-blue-700">{mat.nome}</span>
                  <span className="text-sm text-gray-600">{mat.professor}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700 font-semibold">Faltas</span>
                  <span className={`text-xs font-bold ${mat.emRisco ? 'text-red-600' : 'text-blue-700'}`}>{mat.totalFaltas}/{mat.limiteFaltas}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                  <div
                    className={`h-3 rounded-full ${mat.emRisco ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (mat.totalFaltas / mat.limiteFaltas) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-500">{Math.round((mat.totalFaltas / mat.limiteFaltas) * 100)}%</div>
                {mat.emRisco && <div className="mt-2 text-xs text-red-600 font-semibold">Atenção: matéria em risco!</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 