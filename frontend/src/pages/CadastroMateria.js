// frontend/src/pages/CadastroMateria.js - APENAS A URL DA API FOI ALTERADA

import React, { useState } from 'react';
import api from '../../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CadastroMateria = () => {
    const [formData, setFormData] = useState({
        nome: '',
        professor: '',
        maxFaltas: ''
    });
    const navigate = useNavigate();

    // ADICIONADO: Lê a URL da API da variável de ambiente
    const API_URL = process.env.REACT_APP_API_URL;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // ALTERADO: Usa a variável API_URL em vez de 'localhost'
            await axios.post(`${API_URL}/api/materia`, formData, {
                headers: { 'x-auth-token': token }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="container">
            <h1>Cadastrar Matéria</h1>
            <form onSubmit={onSubmit}>
                <input type="text" name="nome" value={formData.nome} onChange={onChange} placeholder="Nome da Matéria" required />
                <input type="text" name="professor" value={formData.professor} onChange={onChange} placeholder="Professor" />
                <input type="number" name="maxFaltas" value={formData.maxFaltas} onChange={onChange} placeholder="Máximo de Faltas" required />
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
};

export default CadastroMateria;