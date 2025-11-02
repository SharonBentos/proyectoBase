import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = () => {
    fetch('http://localhost:3001/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login usuarios={usuarios} />} />
        <Route
          path="/register"
          element={<Register usuarios={usuarios} onRegister={cargarUsuarios} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;