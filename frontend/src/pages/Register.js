// frontend/src/pages/Register/Register.js - APENAS A URL DA API FOI ALTERADA

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import '../App.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // ADICIONADO: Lê a URL da API da variável de ambiente
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // ALTERADO: Usa a variável API_URL em vez de 'localhost'
            await axios.post(`${API_URL}/api/auth/register`, formData);
            navigate('/login');
        } catch (err) {
            console.error('Erro no registo:', err);
            const errorMessage = err.response && err.response.data && err.response.data.msg
                ? err.response.data.msg
                : 'Erro ao tentar fazer o registo.';
            setError(errorMessage);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Registo</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="register-button">Registar</button>
                </form>
            </div>
        </div>
    );
};

export default Register;