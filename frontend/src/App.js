import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import CadastroMateria from "./pages/CadastroMateria";
import MateriaDetalhe from "./pages/MateriaDetalhe";
import RelatorioGeral from "./pages/RelatorioGeral";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-primary transition-all duration-500">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/materia/nova" element={<PrivateRoute><CadastroMateria /></PrivateRoute>} />
          <Route path="/materia/:id" element={<PrivateRoute><MateriaDetalhe /></PrivateRoute>} />
          <Route path="/relatorio" element={<PrivateRoute><RelatorioGeral /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
