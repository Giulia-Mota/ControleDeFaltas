import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MateriaDetalhe() {
  const { id } = useParams();
  const [materia, setMateria] = useState(null);
  const [faltas, setFaltas] = useState([]);
  const [dataFalta, setDataFalta] = useState("");
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editFaltaId, setEditFaltaId] = useState(null);
  const [editData, setEditData] = useState("");
  const [editObs, setEditObs] = useState("");
  const [progresso, setProgresso] = useState(null);

  useEffect(() => {
    const fetchMateria = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/materias` , {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mat = res.data.find((m) => m._id === id);
        setMateria(mat);
      } catch {
        setErro("Erro ao buscar matéria.");
      }
    };
    const fetchFaltas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/faltas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFaltas(res.data);
      } catch {
        setErro("Erro ao buscar faltas.");
      } finally {
        setLoading(false);
      }
    };
    const fetchProgresso = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/materias/${id}/progresso`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgresso(res.data);
      } catch {
        setProgresso(null);
      }
    };
    fetchMateria();
    fetchFaltas();
    fetchProgresso();
  }, [id]);

  const handleAddFalta = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/faltas`,
        { materiaId: id, data: dataFalta, observacao },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDataFalta("");
      setObservacao("");
      // Atualizar lista de faltas
      const res = await axios.get(`http://localhost:5000/api/faltas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaltas(res.data);
    } catch {
      setErro("Erro ao registrar falta.");
    }
  };

  const handleEditFalta = (falta) => {
    setEditFaltaId(falta._id);
    setEditData(falta.data.slice(0, 10));
    setEditObs(falta.observacao || "");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/faltas/${editFaltaId}`, {
        data: editData,
        observacao: editObs,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditFaltaId(null);
      setEditData("");
      setEditObs("");
      // Atualizar lista de faltas
      const res = await axios.get(`http://localhost:5000/api/faltas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaltas(res.data);
    } catch {
      setErro("Erro ao editar falta.");
    }
  };

  const handleDeleteFalta = async (faltaId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta falta?")) return;
    setErro("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/faltas/${faltaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Atualizar lista de faltas
      const res = await axios.get(`http://localhost:5000/api/faltas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaltas(res.data);
    } catch {
      setErro("Erro ao deletar falta.");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mx-auto mt-8">
      <button onClick={() => navigate("/dashboard")} className="mb-4 text-blue-600 hover:underline">← Voltar</button>
      {materia && (
        <>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">{materia.nome}</h2>
          <div className="text-gray-600 mb-4">Professor: {materia.professor} | Carga horária: {materia.cargaHoraria}h | Limite de faltas: {materia.limiteFaltas}</div>
        </>
      )}
      {progresso && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-700 font-semibold">Progresso de faltas</span>
            <span className={`text-sm font-bold ${progresso.emRisco ? 'text-red-600' : 'text-blue-700'}`}>{progresso.totalFaltas}/{progresso.limiteFaltas} faltas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${progresso.emRisco ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, (progresso.totalFaltas / progresso.limiteFaltas) * 100)}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{Math.round((progresso.totalFaltas / progresso.limiteFaltas) * 100)}%</div>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">Faltas registradas</h3>
      {loading ? (
        <div className="text-center text-gray-500">Carregando...</div>
      ) : erro ? (
        <div className="text-red-600 text-center mb-4">{erro}</div>
      ) : (
        <ul className="mb-6 space-y-2">
          {faltas.length === 0 ? (
            <li className="text-gray-500">Nenhuma falta registrada ainda.</li>
          ) : (
            faltas.map((f) => (
              <li key={f._id} className="border rounded p-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                {editFaltaId === f._id ? (
                  <form onSubmit={handleSaveEdit} className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                    <input type="date" value={editData} onChange={e => setEditData(e.target.value)} required className="px-2 py-1 border rounded" />
                    <input type="text" value={editObs} onChange={e => setEditObs(e.target.value)} placeholder="Observação" className="px-2 py-1 border rounded" />
                    <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">Salvar</button>
                    <button type="button" onClick={() => setEditFaltaId(null)} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button>
                  </form>
                ) : (
                  <>
                    <span>{new Date(f.data).toLocaleDateString()} {f.observacao && <span className="text-gray-500">- {f.observacao}</span>}</span>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button onClick={() => handleEditFalta(f)} className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition">Editar</button>
                      <button onClick={() => handleDeleteFalta(f._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Deletar</button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      )}
      <form onSubmit={handleAddFalta} className="space-y-2">
        <div>
          <label className="block text-gray-700">Data da falta</label>
          <input type="date" value={dataFalta} onChange={e => setDataFalta(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-gray-700">Observação (opcional)</label>
          <input type="text" value={observacao} onChange={e => setObservacao(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Adicionar Falta</button>
      </form>
    </div>
  );
} 