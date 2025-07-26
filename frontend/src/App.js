import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CadastroMateria from './pages/CadastroMateria';
import MateriaDetalhe from './pages/MateriaDetalhe';
// import RelatorioGeral from './pages/RelatorioGeral'; // Linha removida
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/cadastrar-materia" element={<PrivateRoute><CadastroMateria /></PrivateRoute>} />
          <Route path="/materia/:id" element={<PrivateRoute><MateriaDetalhe /></PrivateRoute>} />
          {/* A ROTA PARA O RELATÓRIO GERAL FOI REMOVIDA DAQUI */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;