import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

// Componente SortableItem
const SortableItem = ({ materia, handleDeleteMateria, handleEditMateria }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({ id: materia._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const faltasCount = materia.faltas.length;
  const limiteFaltas = materia.limiteFaltas;
  const percentual = limiteFaltas > 0 ? (faltasCount / limiteFaltas) * 100 : 0;
  const percentualParaBarra = Math.min(percentual, 100);
  let progressBarColor = 'bg-teal-500';
  if (percentual >= 75) { progressBarColor = 'bg-custom-red'; } 
  else if (percentual >= 50) { progressBarColor = 'bg-yellow-500'; }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white p-3 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[100px] max-w-xs touch-manipulation ${
        isDragging ? 'shadow-xl scale-105 rotate-2 z-50' : ''
      }`}
    >
      {/* Ícone de arrastar (handle) */}
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 text-gray-400 touch-none cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: 'none' }}
        tabIndex={0}
        aria-label="Arrastar matéria"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
        </svg>
      </div>

      {/* Ícones de ação */}
      <div className="absolute top-1 right-1 flex gap-1">
        {/* Ícone de editar */}
        <button
          onClick={(e) => handleEditMateria(materia, e)}
          className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50 touch-none"
          title="Editar matéria"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        
        {/* Ícone de lixeira */}
        <button
          onClick={(e) => handleDeleteMateria(materia._id, materia.nome, e)}
          className="text-custom-red hover:text-custom-red-hover transition-colors p-1 rounded-full hover:bg-red-50 touch-none"
          title="Excluir matéria"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <Link to={`/materia/${materia._id}`} className="flex-1 touch-none">
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
};

// Modal de Edição
const EditMateriaModal = ({ materia, isOpen, onClose, onSave }) => {
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

  useEffect(() => {
    if (materia && isOpen) {
      console.log('Inicializando formData com materia:', materia);
      setFormData({
        nome: materia.nome || '',
        professor: materia.professor || '',
        cargaHoraria: materia.cargaHoraria || '',
        aulasPorDia: materia.aulasPorDia || '',
      });
    }
  }, [materia, isOpen]);

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
        setError('Token não encontrado. Faça login novamente.');
        return;
      }
      
      const dadosParaEnviar = {
        nome: formData.nome,
        professor: formData.professor,
        limiteFaltas: limiteEmDias,
        cargaHoraria: parseInt(formData.cargaHoraria, 10),
        aulasPorDia: parseInt(formData.aulasPorDia, 10),
      };

      console.log('Enviando dados para edição:', dadosParaEnviar);

      const response = await api.put(`/materias/${materia._id}`, dadosParaEnviar, {
        headers: { 'x-auth-token': token }
      });
      
      console.log('Resposta do backend após edição:', response.data);
      
      onSave();
      onClose();

    } catch (err) {
      console.error("ERRO AO EDITAR:", err);
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        setTimeout(() => window.location.href = '/login', 2000);
      } else if (err.response) {
        setError(`Erro do servidor: ${err.response.data.message || 'Verifique os dados.'}`);
      } else {
        setError("Erro de rede: Não foi possível conectar ao servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4">
        <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-3">
          <h3 className="text-lg font-bold text-gray-800">Editar Matéria</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg relative mb-3 text-sm" role="alert">{error}</div>}
          
          <div className="mb-3">
            <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="edit-nome">Nome da Matéria</label>
            <input 
              type="text" 
              id="edit-nome" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              placeholder="Ex: Engenharia de Software II" 
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" 
              required 
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="edit-professor">Nome do Professor(a)</label>
            <input 
              type="text" 
              id="edit-professor" 
              name="professor" 
              value={formData.professor} 
              onChange={handleChange} 
              placeholder="Ex: João da Silva" 
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="edit-cargaHoraria">Carga Horária Total</label>
              <input 
                type="number" 
                id="edit-cargaHoraria" 
                name="cargaHoraria" 
                value={formData.cargaHoraria} 
                onChange={handleChange} 
                placeholder="Ex: 68" 
                className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" 
                required 
                min="1" 
              />
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="edit-aulasPorDia">Aulas por Dia</label>
              <input 
                type="number" 
                id="edit-aulasPorDia" 
                name="aulasPorDia" 
                value={formData.aulasPorDia} 
                onChange={handleChange} 
                placeholder="Ex: 2" 
                className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" 
                required 
                min="1" 
              />
            </div>
          </div>

          {limiteEmDias > 0 && (
            <div className="mb-4 p-2 bg-purple-100 border border-purple-300 rounded-lg text-center">
              <p className="text-gray-700 text-xs">Com base nestes dados, você pode faltar no máximo:</p>
              <p className="text-lg font-bold text-purple-800 mt-1">{limiteEmDias} dias</p>
              <p className="text-xs text-gray-500 mt-1">(Total de {limiteEmHoras} horas de falta permitidas)</p>
            </div>
          )}

          <div className="flex gap-2">
            <button 
              type="submit" 
              className="flex-1 bg-purple-800 text-white p-2 rounded-lg hover:bg-purple-900 transition-colors duration-300 font-bold text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition-colors font-bold text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMateria, setEditingMateria] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Função para verificar se o token está expirado
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Função para limpar token expirado e redirecionar
  const handleExpiredToken = useCallback(() => {
    localStorage.removeItem('token');
    setError('Sessão expirada. Redirecionando para login...');
    setTimeout(() => navigate('/login'), 2000);
  }, [navigate]);

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

        // Verificar se o token está expirado
        if (isTokenExpired(token)) {
          handleExpiredToken();
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
          handleExpiredToken();
          return;
        } else {
          setError('Não foi possível carregar os dados. Tente novamente.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, handleExpiredToken]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteMateria = async (materiaId, materiaNome, e) => {
    e.preventDefault(); // Previne a navegação do Link
    if (window.confirm(`Tem certeza que deseja excluir a matéria "${materiaNome}"?`)) {
      try {
        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
          handleExpiredToken();
          return;
        }

        await api.delete(`/materias/${materiaId}`, {
          headers: { 'x-auth-token': token }
        });
        // Recarrega as matérias após excluir
        const materiasResponse = await api.get('/materias', {
          headers: { 'x-auth-token': token }
        });
        setMaterias(materiasResponse.data);
      } catch (err) {
        if (err.response?.status === 401) {
          handleExpiredToken();
        } else {
          setError('Não foi possível excluir a matéria.');
        }
      }
    }
  };

  const handleEditMateria = (materia, e) => {
    e.preventDefault(); // Previne a navegação do Link
    setEditingMateria(materia);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        handleExpiredToken();
        return;
      }

      const materiasResponse = await api.get('/materias', {
        headers: { 'x-auth-token': token }
      });
      
      console.log('Matérias recarregadas após edição:', materiasResponse.data);
      
      setMaterias(materiasResponse.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleExpiredToken();
      } else {
        setError('Não foi possível recarregar as matérias.');
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setMaterias((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={materias.map(m => m._id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {materias.map((materia) => (
                      <SortableItem
                        key={materia._id}
                        materia={materia}
                        handleDeleteMateria={handleDeleteMateria}
                        handleEditMateria={handleEditMateria}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-3 text-sm">Você ainda não cadastrou nenhuma matéria.</p>
          )}
        </main>
      </div>

      {/* Modal de Edição */}
      <EditMateriaModal
        materia={editingMateria}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMateria(null);
        }}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default Dashboard;