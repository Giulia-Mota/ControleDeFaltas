// frontend/src/pages/Dashboard.js - APENAS A URL DA API FOI ALTERADA

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const res = await api.get('/materias');
                setMaterias(res.data);
            } catch (err) {
                setError('Erro ao carregar matérias');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterias();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1>Dashboard</h1>
            <Link to="/add-materia">Adicionar Matéria</Link>
            <div className="materias-grid">
                {materias.map(materia => (
                    <div key={materia._id} className="materia-card">
                        <Link to={`/materia/${materia._id}`}>
                            <h2>{materia.nome}</h2>
                            <p>{materia.professor}</p>
                            <p>Faltas: {materia.faltas} de {materia.maxFaltas}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;