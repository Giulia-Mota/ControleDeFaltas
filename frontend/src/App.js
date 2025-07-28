import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CadastroMateria from './pages/CadastroMateria';
import MateriaDetalhe from './pages/MateriaDetalhe';
import CalendarioFaltas from './pages/CalendarioFaltas';
import PrivateRoute from './components/PrivateRoute';

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
          <Route path="/calendario-faltas" element={<PrivateRoute><CalendarioFaltas /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;