// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Colaborador from './pages/Colaborador';
import Admin from './pages/Admin';

export default function App() {
  const [user, setUser] = useState(null);
  const [registros, setRegistros] = useState([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ponto-registros-v2');
    if (saved) {
      try {
        setRegistros(JSON.parse(saved));
      } catch (e) { console.error("Erro ao carregar registros", e); }
    }
  }, []);

  const handleSave = (novosRegistros) => {
    try {
      localStorage.setItem('ponto-registros-v2', JSON.stringify(novosRegistros));
      setRegistros(novosRegistros);
    } catch (e) {
      alert('Erro: Limite de armazenamento local excedido. Tente limpar anexos antigos.');
    }
  };

  // Roteamento Simples
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  if (user.tipo === 'admin') {
    return <Admin user={user} registros={registros} onSave={handleSave} onLogout={() => setUser(null)} />;
  }

  return <Colaborador user={user} registros={registros} onSave={handleSave} onLogout={() => setUser(null)} />;
}