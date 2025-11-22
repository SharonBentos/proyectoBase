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
  const response = await fetch(`${API_BASE_URL}/participantes/`);
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
  const response = await fetch(`${API_BASE_URL}/participantes/${ci}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

// ============================================
// SALAS
// ============================================

export const obtenerSalas = async () => {
  const response = await fetch(`${API_BASE_URL}/salas/`);
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
  const response = await fetch(`${API_BASE_URL}/salas/${nombreSala}/${edificio}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

// ============================================
// RESERVAS
// ============================================

export const obtenerReservas = async (ci = null) => {
  const url = ci ? `${API_BASE_URL}/reservas/?ci=${ci}` : `${API_BASE_URL}/reservas/`;
  const response = await fetch(url);
  const reservas = await handleResponse(response);
  
  // Enriquecer con datos de turnos para mostrar hora_inicio y hora_fin
  const turnos = await obtenerTurnos();
  
  return reservas.map(reserva => {
    const turno = turnos.find(t => t.id_turno === reserva.id_turno);
    return {
      ...reserva,
      hora_inicio: turno?.hora_inicio || '00:00:00',
      hora_fin: turno?.hora_fin || '00:00:00'
    };
  });
};

export const obtenerReserva = async (id) => {
  const response = await fetch(`${API_BASE_URL}/reservas/${id}`);
  return handleResponse(response);
};

export const crearReserva = async (reservaData) => {
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
  const response = await fetch(`${API_BASE_URL}/reservas/${idReserva}/cancelar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse(response);
};

export const registrarAsistencia = async (idReserva, ciParticipante, asistencia) => {
  const response = await fetch(
    `${API_BASE_URL}/reservas/${idReserva}/asistencia?ci_participante=${ciParticipante}&asistencia=${asistencia}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return handleResponse(response);
};

// ============================================
// SANCIONES
// ============================================

export const obtenerSanciones = async () => {
  const response = await fetch(`${API_BASE_URL}/sanciones/`);
  return handleResponse(response);
};

export const obtenerSancionesPorParticipante = async (ci) => {
  // Backend no tiene endpoint específico, filtramos del lado del cliente
  const todasSanciones = await obtenerSanciones();
  return todasSanciones.filter(s => s.ci_participante === ci);
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
  const response = await fetch(`${API_BASE_URL}/sanciones/${idSancion}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

// ============================================
// TURNOS
// ============================================

export const obtenerTurnos = async () => {
  // Backend no tiene router para turnos, usamos datos estáticos desde la BD
  // Los turnos son bloques fijos de 1 hora entre 08:00 y 23:00
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
};

// ============================================
// EDIFICIOS Y PROGRAMAS
// ============================================

export const obtenerEdificios = async () => {
  // Obtener edificios únicos desde las salas disponibles
  const salas = await obtenerSalas();
  const edificiosUnicos = [...new Set(salas.map(sala => sala.edificio))];
  return edificiosUnicos.map(edificio => ({ nombre_edificio: edificio }));
};

export const obtenerProgramas = async () => {
  // Backend no tiene router para programas, retornamos array vacío
  // TODO: Implementar endpoint en backend si se necesita
  return [];
};

// ============================================
// ESTADÍSTICAS (ADMIN)
// ============================================

export const obtenerEstadisticas = async () => {
  // Backend no tiene endpoint de stats, calculamos desde los datos reales
  try {
    const [participantes, salas, reservas, sanciones] = await Promise.all([
      obtenerParticipantes(),
      obtenerSalas(),
      obtenerReservas(),
      obtenerSanciones()
    ]);
    
    const hoy = new Date().toISOString().split('T')[0];
    
    return {
      totalParticipantes: participantes.length,
      totalSalas: salas.length,
      reservasActivas: reservas.filter(r => r.estado === 'activa').length,
      sancionesActivas: sanciones.filter(s => {
        // Comparar fechas como strings en formato YYYY-MM-DD
        return s.fecha_fin && s.fecha_fin >= hoy;
      }).length
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    // Retornar valores por defecto si hay error
    return {
      totalParticipantes: 0,
      totalSalas: 0,
      reservasActivas: 0,
      sancionesActivas: 0
    };
  }
};

