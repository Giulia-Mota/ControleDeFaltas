import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import 'react-calendar/dist/Calendar.css';

const CalendarioFaltas = () => {
  const [faltasPorData, setFaltasPorData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [materiasSelecionadas, setMateriasSelecionadas] = useState([]);
  const [showAddFalta, setShowAddFalta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tooltipData, setTooltipData] = useState({ show: false, content: [], x: 0, y: 0 });
  const navigate = useNavigate();

  const fetchFaltasEMaterias = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const faltasResp = await api.get('/faltas/usuario', {
        headers: { 'x-auth-token': token }
      });
      setFaltasPorData(faltasResp.data);
      const materiasResp = await api.get('/materias', {
        headers: { 'x-auth-token': token }
      });
      setMaterias(materiasResp.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchFaltasEMaterias();
  }, [fetchFaltasEMaterias]);

  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = date.toISOString().split('T')[0];
    if (faltasPorData[dateStr]) {
      const materiasFaltadas = faltasPorData[dateStr].map(f => f.materiaNome);
      return (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipData({
              show: true,
              content: materiasFaltadas,
              x: rect.left + rect.width / 2,
              y: rect.top - 10
            });
          }}
          onMouseLeave={() => setTooltipData({ show: false, content: [], x: 0, y: 0 })}
        >
          <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{date.getDate()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const dateStr = date.toISOString().split('T')[0];
    if (faltasPorData[dateStr]) {
      return 'react-calendar__tile--faltou';
    }
    return '';
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowAddFalta(true);
    setMateriasSelecionadas([]);
  };

  const handleMateriaToggle = (materiaId) => {
    setMateriasSelecionadas(prev => {
      if (prev.includes(materiaId)) {
        return prev.filter(id => id !== materiaId);
      } else {
        return [...prev, materiaId];
      }
    });
  };

  const handleSelectAll = () => {
    if (materiasSelecionadas.length === materias.length) {
      setMateriasSelecionadas([]);
    } else {
      setMateriasSelecionadas(materias.map(m => m._id));
    }
  };

  const handleAddFalta = async () => {
    if (materiasSelecionadas.length === 0) {
      setError('Selecione pelo menos uma matéria.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Adicionar faltas para todas as matérias selecionadas
      const promises = materiasSelecionadas.map(materiaId =>
        api.post(`/materias/${materiaId}/faltas`, {
          date: selectedDate.toISOString().split('T')[0]
        }, {
          headers: { 'x-auth-token': token }
        })
      );

      await Promise.all(promises);
      
      setShowAddFalta(false);
      setMateriasSelecionadas([]);
      
      await fetchFaltasEMaterias();
    } catch (err) {
      console.error('Erro ao adicionar falta:', err);
      setError('Erro ao adicionar falta.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full bg-[#F5F5F5] p-4 rounded-2xl shadow-2xl" style={{ maxWidth: '480px' }}>
        <div className="bg-purple-800 text-white p-4 rounded-2xl mb-4">
          <h2 className="text-xl font-bold text-center">Calendário de Faltas</h2>
          <p className="text-center mt-1 opacity-90 text-sm">Visualize e gerencie suas faltas por data</p>
        </div>
        
        <div className="mb-4">
          <Link 
            to="/dashboard" 
            className="bg-gray-600 text-white text-center font-bold py-1.5 px-3 rounded-lg hover:bg-gray-700 transition-colors text-xs inline-block"
          >
            Voltar
          </Link>
        </div>
        
        <div className="bg-[#F5F5F5] p-4 rounded-2xl shadow-lg">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="calendar-container">
                <Calendar
                  onClickDay={handleDayClick}
                  tileContent={getTileContent}
                  tileClassName={getTileClassName}
                  className="modern-calendar"
                />
              </div>
            </div>
          )}
        </div>

        {showAddFalta && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-4">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  Adicionar faltas em {selectedDate && selectedDate.toLocaleDateString('pt-BR')}
                </h3>
                <button onClick={() => setShowAddFalta(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Selecione as matérias:</span>
                  <button
                    onClick={handleSelectAll}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    {materiasSelecionadas.length === materias.length ? 'Desmarcar todas' : 'Marcar todas'}
                  </button>
                </div>
                
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {materias.map(materia => (
                    <label key={materia._id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={materiasSelecionadas.includes(materia._id)}
                        onChange={() => handleMateriaToggle(materia._id)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700">{materia.nome}</span>
                    </label>
                  ))}
                </div>
                
                {materiasSelecionadas.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {materiasSelecionadas.length} matéria{materiasSelecionadas.length > 1 ? 's' : ''} selecionada{materiasSelecionadas.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-purple-800 text-white py-2 px-3 rounded-lg hover:bg-purple-900 transition-colors font-semibold disabled:opacity-50 text-sm"
                  onClick={handleAddFalta}
                  disabled={materiasSelecionadas.length === 0}
                >
                  Adicionar {materiasSelecionadas.length > 0 ? `(${materiasSelecionadas.length})` : ''}
                </button>
                <button
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold text-sm"
                  onClick={() => setShowAddFalta(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {tooltipData.show && (
        <div
          className="fixed z-50 px-2 py-1 bg-purple-800 text-white text-xs rounded-lg shadow-2xl border border-purple-700 pointer-events-none"
          style={{
            left: tooltipData.x,
            top: tooltipData.y,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          <div className="text-center">
            <div className="text-xs text-white font-semibold mb-1">
              Matérias que faltou:
            </div>
            <div className="text-xs text-white font-medium">
              {tooltipData.content.map((materia, index) => (
                <div key={index}>{materia}</div>
              ))}
            </div>
          </div>
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-800"
            style={{ marginTop: '-1px' }}
          ></div>
        </div>
      )}

      <style>{`
        .calendar-container {
          width: 100%;
          max-width: 480px;
        }
        
        .modern-calendar {
          width: 100% !important;
          border: none !important;
          background: transparent !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
        
        .modern-calendar .react-calendar__navigation {
          background: #6b21a8 !important;
          border-radius: 12px 12px 0 0 !important;
          padding: 6px 0 12px 0 !important;
          margin-bottom: 0 !important;
        }
        
        .modern-calendar .react-calendar__navigation button {
          background: transparent !important;
          border: none !important;
          color: white !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          padding: 6px 10px !important;
          border-radius: 8px !important;
          transition: all 0.2s !important;
        }
        
        .modern-calendar .react-calendar__navigation button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
        
        .modern-calendar .react-calendar__navigation__label {
          font-size: 18px !important;
          font-weight: 700 !important;
        }
        
        .modern-calendar .react-calendar__month-view__weekdays {
          background: #f8fafc !important;
          padding: 8px 0 !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        
        .modern-calendar .react-calendar__month-view__weekdays__weekday {
          font-weight: 600 !important;
          color: #64748b !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.5px !important;
        }
        
        .modern-calendar .react-calendar__month-view__days {
          background: white !important;
          border-radius: 0 0 12px 12px !important;
          overflow: hidden !important;
        }
        
        .modern-calendar .react-calendar__tile {
          background: transparent !important;
          border: none !important;
          padding: 8px !important;
          position: relative !important;
          transition: all 0.2s !important;
          border-radius: 8px !important;
          margin: 1px !important;
          color: #374151 !important;
        }
        
        .modern-calendar .react-calendar__tile:hover {
          background: #f1f5f9 !important;
          transform: scale(1.05) !important;
        }
        
        .modern-calendar .react-calendar__tile--active {
          background: #3b82f6 !important;
          color: white !important;
        }
        
        .modern-calendar .react-calendar__tile--faltou {
          background: transparent !important;
          color: #374151 !important;
        }
        
        .modern-calendar .react-calendar__tile--faltou:hover {
          background: rgba(239, 68, 68, 0.1) !important;
        }
        
        .modern-calendar .react-calendar__tile--now {
          background: #fef3c7 !important;
          color: #92400e !important;
          font-weight: 600 !important;
        }
        
        .modern-calendar .react-calendar__tile--neighboringMonth {
          color: #9ca3af !important;
        }
        
        .modern-calendar .react-calendar__tile abbr {
          color: inherit !important;
          text-decoration: none !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarioFaltas; 