// Configuración de la API
const API_BASE_URL = 'http://localhost:8000';

// 🎭 MODO DESARROLLO: Cambiar a false cuando el backend esté listo
const MOCK_MODE = false;

// ============================================
// HELPER FUNCTIONS
// ============================================

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error en la petición' }));
    throw new Error(error.detail || 'Error en la petición');
  }
  return response.json();
};

// ============================================
// AUTENTICACIÓN
// ============================================

export const loginAPI = async (correo, password) => {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });
  return handleResponse(response);
};

export const obtenerPerfilUsuario = async () => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse(response);
};

// ============================================
// PARTICIPANTES
// ============================================

export const obtenerParticipantes = async () => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { ci: '101', nombre: 'Ana', apellido: 'Pérez', email: 'ana@uni.edu' },
      { ci: '102', nombre: 'Bruno', apellido: 'Silva', email: 'bruno@uni.edu' },
      { ci: '103', nombre: 'Carla', apellido: 'López', email: 'carla@uni.edu' },
      { ci: '104', nombre: 'Diego', apellido: 'Martínez', email: 'diego@uni.edu' },
      { ci: '105', nombre: 'Elena', apellido: 'García', email: 'elena@uni.edu' },
      { ci: '113', nombre: 'Marta', apellido: 'Gómez', email: 'marta@uni.edu' },
      { ci: '114', nombre: 'Nico', apellido: 'Fernández', email: 'nico@uni.edu' },
      { ci: '115', nombre: 'Olga', apellido: 'Santos', email: 'olga@uni.edu' },
      { ci: '116', nombre: 'Pablo', apellido: 'Da Costa', email: 'pablo@uni.edu' },
      { ci: '999', nombre: 'Admin', apellido: 'Sistema', email: 'admin@uni.edu' }
    ];
  }
  const response = await fetch(`${API_BASE_URL}/participantes`);
  return handleResponse(response);
};

export const obtenerParticipante = async (ci) => {
  const response = await fetch(`${API_BASE_URL}/participantes/${ci}`);
  return handleResponse(response);
};

export const crearParticipante = async (data) => {
  const response = await fetch(`${API_BASE_URL}/participantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const actualizarParticipante = async (ci, data) => {
  const response = await fetch(`${API_BASE_URL}/participantes/${ci}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const eliminarParticipante = async (ci) => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Participante eliminado (MOCK):', ci);
    return { mensaje: 'Participante eliminado correctamente (MOCK)' };
  }
  const response = await fetch(`${API_BASE_URL}/participantes/${ci}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

// ============================================
// SALAS
// ============================================

export const obtenerSalas = async () => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { nombre_sala: '101', edificio: 'Aulario Central', capacidad: 40, tipo_sala: 'libre' },
      { nombre_sala: '102', edificio: 'Aulario Central', capacidad: 35, tipo_sala: 'libre' },
      { nombre_sala: '201', edificio: 'Aulario Central', capacidad: 30, tipo_sala: 'libre' },
      { nombre_sala: 'Lab 1', edificio: 'Ingeniería', capacidad: 25, tipo_sala: 'libre' },
      { nombre_sala: 'Lab 2', edificio: 'Ingeniería', capacidad: 25, tipo_sala: 'docente' },
      { nombre_sala: 'Sala A', edificio: 'Posgrados', capacidad: 20, tipo_sala: 'posgrado' },
      { nombre_sala: 'Sala B', edificio: 'Posgrados', capacidad: 15, tipo_sala: 'posgrado' },
      { nombre_sala: 'Docente 1', edificio: 'Facultad', capacidad: 10, tipo_sala: 'docente' },
      { nombre_sala: '301', edificio: 'Biblioteca', capacidad: 50, tipo_sala: 'libre' },
      { nombre_sala: '302', edificio: 'Biblioteca', capacidad: 45, tipo_sala: 'libre' }
    ];
  }
  const response = await fetch(`${API_BASE_URL}/salas`);
  return handleResponse(response);
};

export const obtenerSala = async (nombreSala, edificio) => {
  const response = await fetch(`${API_BASE_URL}/salas/${nombreSala}/${edificio}`);
  return handleResponse(response);
};

export const crearSala = async (data) => {
  const response = await fetch(`${API_BASE_URL}/salas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const actualizarSala = async (nombreSala, edificio, data) => {
  const response = await fetch(`${API_BASE_URL}/salas/${nombreSala}/${edificio}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const eliminarSala = async (nombreSala, edificio) => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Sala eliminada (MOCK):', nombreSala, edificio);
    return { mensaje: 'Sala eliminada correctamente (MOCK)' };
  }
  const response = await fetch(`${API_BASE_URL}/salas/${nombreSala}/${edificio}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

// ============================================
// RESERVAS
// ============================================

export const obtenerReservas = async () => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const hoy = new Date().toISOString().split('T')[0];
    const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const manana = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    return [
      { id_reserva: 2001, nombre_sala: '101', edificio: 'Aulario Central', fecha: hoy, id_turno: 1, hora_inicio: '08:00:00', hora_fin: '09:00:00', estado: 'activa', participantes_ci: ['101', '102'], asistencia: false },
      { id_reserva: 2002, nombre_sala: '102', edificio: 'Aulario Central', fecha: hoy, id_turno: 3, hora_inicio: '10:00:00', hora_fin: '11:00:00', estado: 'activa', participantes_ci: ['101', '103'], asistencia: false },
      { id_reserva: 2003, nombre_sala: 'Lab 1', edificio: 'Ingeniería', fecha: manana, id_turno: 5, hora_inicio: '12:00:00', hora_fin: '13:00:00', estado: 'activa', participantes_ci: ['101'], asistencia: false },
      { id_reserva: 2004, nombre_sala: '201', edificio: 'Aulario Central', fecha: ayer, id_turno: 2, hora_inicio: '09:00:00', hora_fin: '10:00:00', estado: 'finalizada', participantes_ci: ['101', '104'], asistencia: true },
      { id_reserva: 2005, nombre_sala: 'Sala A', edificio: 'Posgrados', fecha: hoy, id_turno: 4, hora_inicio: '11:00:00', hora_fin: '12:00:00', estado: 'activa', participantes_ci: ['115'], asistencia: false },
      { id_reserva: 2006, nombre_sala: 'Lab 2', edificio: 'Ingeniería', fecha: hoy, id_turno: 6, hora_inicio: '13:00:00', hora_fin: '14:00:00', estado: 'activa', participantes_ci: ['113', '114'], asistencia: false },
      { id_reserva: 2007, nombre_sala: '301', edificio: 'Biblioteca', fecha: manana, id_turno: 7, hora_inicio: '14:00:00', hora_fin: '15:00:00', estado: 'activa', participantes_ci: ['102', '103', '104'], asistencia: false }
    ];
  }
  const response = await fetch(`${API_BASE_URL}/reservas`);
  return handleResponse(response);
};

export const obtenerReserva = async (id) => {
  const response = await fetch(`${API_BASE_URL}/reservas/${id}`);
  return handleResponse(response);
};

export const crearReserva = async (reservaData) => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Reserva creada (MOCK):', reservaData);
    return { id_reserva: Math.floor(Math.random() * 9000) + 3000, mensaje: 'Reserva creada correctamente (MOCK)' };
  }
  const response = await fetch(`${API_BASE_URL}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservaData)
  });
  return handleResponse(response);
};

export const actualizarReserva = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const cancelarReserva = async (idReserva) => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Reserva cancelada (MOCK):', idReserva);
    return { mensaje: 'Reserva cancelada correctamente (MOCK)' };
  }
  const response = await fetch(`${API_BASE_URL}/reservas/${idReserva}/cancelar`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

export const registrarAsistencia = async (idReserva, ciParticipante, asistencia) => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Asistencia registrada (MOCK):', idReserva, ciParticipante, asistencia);
    return { mensaje: 'Asistencia registrada correctamente (MOCK)' };
  }
  const response = await fetch(`${API_BASE_URL}/reservas/${idReserva}/asistencia`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ci_participante: ciParticipante, asistencia })
  });
  return handleResponse(response);
};

// ============================================
// SANCIONES
// ============================================

export const obtenerSanciones = async () => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const hoy = new Date();
    const doseMesesAtras = new Date(hoy.getTime() - 60 * 24 * 60 * 60 * 1000);
    const unMesDespues = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return [
      { id_sancion: 101, ci_participante: '101', fecha_inicio: doseMesesAtras.toISOString().split('T')[0], fecha_fin: unMesDespues.toISOString().split('T')[0], motivo: 'No asistió a reserva' },
      { id_sancion: 102, ci_participante: '102', fecha_inicio: doseMesesAtras.toISOString().split('T')[0], fecha_fin: unMesDespues.toISOString().split('T')[0], motivo: 'No asistió a reserva' },
      { id_sancion: 103, ci_participante: '104', fecha_inicio: '2025-09-01', fecha_fin: '2025-10-31', motivo: 'No canceló reserva' },
      { id_sancion: 104, ci_participante: '105', fecha_inicio: '2025-10-01', fecha_fin: '2025-11-15', motivo: 'No asistió a reserva' }
    ];
  }
  const response = await fetch(`${API_BASE_URL}/sanciones`);
  return handleResponse(response);
};

export const obtenerSancionesPorParticipante = async (ci) => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const todasSanciones = await obtenerSanciones();
    return todasSanciones.filter(s => s.ci_participante === ci);
  }
  const response = await fetch(`${API_BASE_URL}/sanciones/participante/${ci}`);
  return handleResponse(response);
};

export const crearSancion = async (data) => {
  const response = await fetch(`${API_BASE_URL}/sanciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const actualizarSancion = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/sanciones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const eliminarSancion = async (idSancion) => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Sanción eliminada (MOCK):', idSancion);
    return { mensaje: 'Sanción eliminada correctamente (MOCK)' };
  }
  const response = await fetch(`${API_BASE_URL}/sanciones/${idSancion}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

// ============================================
// TURNOS
// ============================================

export const obtenerTurnos = async () => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id_turno: 1, hora_inicio: '08:00:00', hora_fin: '09:00:00' },
      { id_turno: 2, hora_inicio: '09:00:00', hora_fin: '10:00:00' },
      { id_turno: 3, hora_inicio: '10:00:00', hora_fin: '11:00:00' },
      { id_turno: 4, hora_inicio: '11:00:00', hora_fin: '12:00:00' },
      { id_turno: 5, hora_inicio: '12:00:00', hora_fin: '13:00:00' },
      { id_turno: 6, hora_inicio: '13:00:00', hora_fin: '14:00:00' },
      { id_turno: 7, hora_inicio: '14:00:00', hora_fin: '15:00:00' },
      { id_turno: 8, hora_inicio: '15:00:00', hora_fin: '16:00:00' },
      { id_turno: 9, hora_inicio: '16:00:00', hora_fin: '17:00:00' },
      { id_turno: 10, hora_inicio: '17:00:00', hora_fin: '18:00:00' },
      { id_turno: 11, hora_inicio: '18:00:00', hora_fin: '19:00:00' },
      { id_turno: 12, hora_inicio: '19:00:00', hora_fin: '20:00:00' },
      { id_turno: 13, hora_inicio: '20:00:00', hora_fin: '21:00:00' },
      { id_turno: 14, hora_inicio: '21:00:00', hora_fin: '22:00:00' },
      { id_turno: 15, hora_inicio: '22:00:00', hora_fin: '23:00:00' }
    ];
  }
  const response = await fetch(`${API_BASE_URL}/turnos`);
  return handleResponse(response);
};

// ============================================
// EDIFICIOS Y PROGRAMAS
// ============================================

export const obtenerEdificios = async () => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { nombre_edificio: 'Aulario Central', direccion: 'Av. Universitaria 1234', departamento: 'Montevideo' },
      { nombre_edificio: 'Ingeniería', direccion: 'Av. Universitaria 1240', departamento: 'Montevideo' },
      { nombre_edificio: 'Posgrados', direccion: 'Av. Universitaria 1250', departamento: 'Montevideo' },
      { nombre_edificio: 'Biblioteca', direccion: 'Av. Universitaria 1260', departamento: 'Montevideo' },
      { nombre_edificio: 'Facultad', direccion: 'Av. Universitaria 1270', departamento: 'Montevideo' }
    ];
  }
  const response = await fetch(`${API_BASE_URL}/edificios`);
  return handleResponse(response);
};

export const obtenerProgramas = async () => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { nombre_programa: 'Ingeniería Informática', id_facultad: 1, tipo: 'grado' },
      { nombre_programa: 'Ingeniería Electrónica', id_facultad: 1, tipo: 'grado' },
      { nombre_programa: 'Psicología', id_facultad: 2, tipo: 'grado' },
      { nombre_programa: 'Comunicación', id_facultad: 3, tipo: 'grado' },
      { nombre_programa: 'Data Science', id_facultad: 1, tipo: 'posgrado' },
      { nombre_programa: 'MBA', id_facultad: 4, tipo: 'posgrado' }
    ];
  }
  const response = await fetch(`${API_BASE_URL}/programas`);
  return handleResponse(response);
};

// ============================================
// ESTADÍSTICAS (ADMIN)
// ============================================

export const obtenerEstadisticas = async () => {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      totalParticipantes: 20,
      totalSalas: 10,
      reservasActivas: 15,
      sancionesActivas: 2
    };
  }
  const response = await fetch(`${API_BASE_URL}/stats`);
  return handleResponse(response);
};

