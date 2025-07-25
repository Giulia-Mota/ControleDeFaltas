// frontend/src/pages/MateriaDetalhe.js - APENAS A URL DA API FOI ALTERADA

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';

const MateriaDetalhe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [materia, setMateria] = useState(null);
    const [faltas, setFaltas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ADICIONADO: Lê a URL da API da variável de ambiente
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchDetalhes = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                
                // ALTERADO: Usa a variável API_URL em vez de 'localhost'
                const resMateria = await axios.get(`${API_URL}/api/materia/${id}`, config);
                setMateria(resMateria.data);

                // ALTERADO: Usa a variável API_URL em vez de 'localhost'
                const resFaltas = await axios.get(`${API_URL}/api/falta/${id}`, config);
                setFaltas(resFaltas.data);

            } catch (err) {
                setError('Erro ao carregar detalhes da matéria');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalhes();
    }, [id, API_URL]);

    const adicionarFalta = async () => {
        try {
            const token = localStorage.getItem('token');
            // ALTERADO: Usa a variável API_URL em vez de 'localhost'
            const res = await axios.post(`${API_URL}/api/falta`, { materiaId: id, data: new Date() }, {
                headers: { 'x-auth-token': token }
            });
            setFaltas([...faltas, res.data]);
            // Atualizar contagem de faltas na matéria
            setMateria(prev => ({ ...prev, faltas: prev.faltas + 1 }));
        } catch (err) {
            console.error('Erro ao adicionar falta', err);
        }
    };

    const deletarMateria = async () => {
        if (window.confirm('Tem a certeza que quer apagar esta matéria e todas as suas faltas?')) {
            try {
                const token = localStorage.getItem('token');
                // ALTERADO: Usa a variável API_URL em vez de 'localhost'
                await axios.delete(`${API_URL}/api/materia/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                navigate('/dashboard');
            } catch (err) {
                console.error('Erro ao apagar matéria', err);
            }
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;
    if (!materia) return <p>Matéria não encontrada.</p>;

    return (
        <div className="container">
            <h1>{materia.nome}</h1>
            <p>Professor: {materia.professor}</p>
            <p>Faltas: {materia.faltas} / {materia.maxFaltas}</p>
            <button onClick={adicionarFalta}>Adicionar Falta</button>
            <button onClick={deletarMateria} style={{ backgroundColor: 'red', marginLeft: '10px' }}>Apagar Matéria</button>
            
            <h2>Histórico de Faltas</h2>
            <ul>
                {faltas.map(falta => (
                    <li key={falta._id}>
                        {new Date(falta.data).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MateriaDetalhe;