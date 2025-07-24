import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CadastroMateria from './pages/CadastroMateria';
import MateriaDetalhe from './pages/MateriaDetalhe';
import RelatorioGeral from './pages/RelatorioGeral';
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Mantenha este import, vamos esvaziar o App.css

function App() {
  return (
    <Router>
      {/* A classe "App" não deve ter um fundo próprio, permitindo que o de index.css apareça */}
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/cadastrar-materia" element={<PrivateRoute><CadastroMateria /></PrivateRoute>} />
          <Route path="/materia/:id" element={<PrivateRoute><MateriaDetalhe /></PrivateRoute>} />
          <Route path="/relatorio-geral" element={<PrivateRoute><RelatorioGeral /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;