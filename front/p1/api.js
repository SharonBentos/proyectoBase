// src/api.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3003';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`API ${res.status} ${res.statusText} ${text}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const getSalones = () => request('/salones');
export const getReservas = () => request('/reservas');
export const getReservasPorUsuario = usuario => request(`/reservas?usuario=${encodeURIComponent(usuario)}`);
export const crearReserva = body => request('/reservas', { method: 'POST', body: JSON.stringify(body) });
export const eliminarReserva = id => request(`/reservas/${id}`, { method: 'DELETE' });
export const getReservasPorSalonFecha = (salon, fecha) =>
  request(`/reservas?salon=${encodeURIComponent(salon)}&fecha=${encodeURIComponent(fecha)}`);