import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register({ usuarios, onRegister }) {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('docente');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const existe = usuarios.find(u => u.nombre === nombre);
    if (existe) {
      alert('Ese nombre ya está registrado');
      return;
    }

    const nuevoUsuario = { nombre, password, rol };
    await fetch('http://localhost:3001/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario)
    });

    onRegister(); // recarga usuarios desde el backend
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Crear nuevo usuario</h2>
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
        <select value={rol} onChange={e => setRol(e.target.value)}>
          <option value="docente">Docente</option>
          <option value="alumno de grado">Alumno de grado</option>
          <option value="alumno de postgrado">Alumno de postgrado</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}