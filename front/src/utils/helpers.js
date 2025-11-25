// Formatear fecha para mostrar
export const formatDate = (dateString) => {
  // Evitar problemas de zona horaria usando la fecha local
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-UY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Formatear hora
export const formatTime = (timeString) => {
  if (!timeString) return "";
  return timeString.substring(0, 5); // HH:MM
};

// Obtener el rango de la semana actual
export const getCurrentWeekRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monday = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo (0), retroceder 6 días
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

// Calcular si una fecha está en la semana actual
export const isInCurrentWeek = (dateString) => {
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  const { monday, sunday } = getCurrentWeekRange();
  return date >= monday && date <= sunday;
};

// Validar formato de CI uruguaya
export const validarCI = (ci) => {
  return /^\d{7,8}$/.test(ci);
};

// Validar email
export const validarEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Obtener color según estado de reserva
export const getEstadoColor = (estado) => {
  const colors = {
    activa: "#4CAF50",
    finalizada: "#2196F3",
    cancelada: "#F44336",
    "sin asistencia": "#FF9800",
  };
  return colors[estado] || "#9E9E9E";
};

// Obtener color según tipo de sala
export const getTipoSalaColor = (tipo) => {
  const colors = {
    libre: "#4CAF50",
    posgrado: "#2196F3",
    docente: "#9C27B0",
  };
  return colors[tipo] || "#9E9E9E";
};

// Verificar si una fecha es hoy
export const isToday = (dateString) => {
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
};

// Obtener fecha actual en formato YYYY-MM-DD
export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
