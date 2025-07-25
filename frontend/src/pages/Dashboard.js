// frontend/src/pages/Dashboard/Dashboard.js - CÓDIGO CORRIGIDO

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'x-auth-token': token
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/students`, config);
                setStudents(res.data);
            } catch (err) {
                console.error('Erro ao buscar alunos:', err);
                setMessage('Falha ao carregar alunos.');
            }
        };
        fetchStudents();
    }, [API_URL, token]); // Removido 'config' da dependência

    const addAbsence = async (studentId) => {
        try {
            const res = await axios.post(`${API_URL}/api/absences`, { studentId }, config);
            const updatedStudents = students.map(student =>
                student._id === studentId ? res.data : student
            );
            setStudents(updatedStudents);
            setMessage('Falta adicionada com sucesso!');
        } catch (err) {
            console.error('Erro ao adicionar falta:', err);
            setMessage('Falha ao adicionar falta.');
        }
    };

    const removeAbsence = async (studentId) => {
        try {
            const res = await axios.delete(`${API_URL}/api/absences/${studentId}`, config);
            const updatedStudents = students.map(student =>
                student._id === studentId ? res.data : student
            );
            setStudents(updatedStudents);
            setMessage('Falta removida com sucesso!');
        } catch (err) {
            console.error('Erro ao remover falta:', err);
            setMessage('Falha ao remover falta.');
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard de Faltas</h1>
            {message && <p className="message">{message}</p>}
            <div className="students-list">
                {students.map(student => (
                    <div key={student._id} className="student-card">
                        <h3>{student.name}</h3>
                        <p>Faltas: {student.absences}</p>
                        <div className="button-group">
                            <button onClick={() => addAbsence(student._id)} className="add-absence-btn">Adicionar Falta</button>
                            <button onClick={() => removeAbsence(student._id)} className="remove-absence-btn">Remover Falta</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;