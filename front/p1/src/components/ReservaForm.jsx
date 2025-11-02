// ReservaForm.js
import { useState } from 'react';

export default function ReservaForm({ onSubmit }) {
  const [form, setForm] = useState({
    edificio: '',
    salon: '',
    hora: '',
    integrantes: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="edificio" placeholder="Edificio" onChange={handleChange} required />
      <input name="salon" placeholder="Salón" onChange={handleChange} required />
      <input name="hora" type="time" onChange={handleChange} required />
      <input name="integrantes" placeholder="Integrantes" onChange={handleChange} required />
      <button type="submit">Reservar</button>
    </form>
  );
}