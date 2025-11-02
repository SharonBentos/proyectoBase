import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ usuarios }) {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const usuario = usuarios.find(u => u.nombre === nombre && u.password === password);
    if (usuario) {
      if (usuario.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ingreso al sistema</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tenés cuenta? <a href="/register">Registrate</a></p>
    </div>
  );
}