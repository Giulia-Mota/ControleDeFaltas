import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        senha,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao fazer login.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative bg-[#D1B3FF] font-sans">
      {/* Onda SVG lateral esquerda */}
      <svg className="absolute left-0 top-0 h-full w-1/3 min-w-[200px] max-w-[400px] z-0" viewBox="0 0 300 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'skewY(-12deg)'}}>
        <path d="M0,0 Q60,200 0,400 Q100,600 0,900 L300,900 L300,0 Z" fill="#7C3AED" />
      </svg>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 z-10 mt-24">
        <h2 className="text-3xl font-bold text-primary-dark text-center mb-8 font-sans">Entrar</h2>
        {erro && <div className="mb-4 text-red-600 text-center">{erro}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">E-mail</label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark bg-creme"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Senha</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark bg-creme"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-dark text-white py-3 rounded-full font-bold text-lg shadow hover:bg-primary transition"
          >
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 font-sans">
          Não tem conta? <Link to="/register" className="text-primary-dark hover:underline font-semibold">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
} 