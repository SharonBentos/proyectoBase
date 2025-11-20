import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { obtenerReservas, obtenerSancionesPorParticipante } from '../../services/api';
import { formatDate, formatTime, getEstadoColor, isInCurrentWeek } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isDocente, isPosgrado } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [sanciones, setSanciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    reservasActivas: 0,
    reservasEstaSemana: 0,
    horasReservadasHoy: 0
  });

  useEffect(() => {
    cargarDatos();
  }, [user]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener reservas del usuario
      const todasReservas = await obtenerReservas();
      const misReservas = todasReservas.filter(r => 
        r.participantes_ci?.includes(user?.ci)
      );
      setReservas(misReservas.slice(0, 5)); // Mostrar solo las últimas 5

      // Obtener sanciones activas
      if (user?.ci) {
        const sancionesData = await obtenerSancionesPorParticipante(user.ci);
        const sancionesActivas = sancionesData.filter(s => 
          new Date(s.fecha_fin) >= new Date()
        );
        setSanciones(sancionesActivas);
      }

      // Calcular estadísticas
      const activas = misReservas.filter(r => r.estado === 'activa').length;
      const estaSemana = misReservas.filter(r => 
        isInCurrentWeek(r.fecha) && r.estado === 'activa'
      ).length;
      const hoy = new Date().toISOString().split('T')[0];
      const horasHoy = misReservas.filter(r => 
        r.fecha === hoy && r.estado === 'activa'
      ).length;

      setStats({
        reservasActivas: activas,
        reservasEstaSemana: estaSemana,
        horasReservadasHoy: horasHoy
      });

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Bienvenido, {user?.nombre || user?.correo}</h1>
          <p className="user-role">
            {isDocente() ? '👨‍🏫 Docente' : isPosgrado() ? '🎓 Posgrado' : '📚 Estudiante'}
          </p>
        </div>

        {/* Alertas de sanciones */}
        {sanciones.length > 0 && (
          <div className="alert alert-warning">
            <h3>⚠️ Tienes sanciones activas</h3>
            <p>No puedes realizar reservas hasta {formatDate(sanciones[0].fecha_fin)}</p>
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.reservasActivas}</h3>
              <p>Reservas Activas</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📆</div>
            <div className="stat-content">
              <h3>{stats.reservasEstaSemana}</h3>
              <p>Esta Semana</p>
              <small>Máximo: 3</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>{stats.horasReservadasHoy}</h3>
              <p>Horas Hoy</p>
              <small>Máximo: 2</small>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            {sanciones.length > 0 ? (
              <div className="action-card disabled" title="No puedes reservar mientras tengas sanciones activas">
                <span className="action-icon">🚫</span>
                <h3>Nueva Reserva</h3>
                <p>Bloqueado por sanción activa</p>
              </div>
            ) : (
              <Link to="/nueva-reserva" className="action-card">
                <span className="action-icon">➕</span>
                <h3>Nueva Reserva</h3>
                <p>Reservar una sala de estudio</p>
              </Link>
            )}

            <Link to="/mis-reservas" className="action-card">
              <span className="action-icon">📋</span>
              <h3>Mis Reservas</h3>
              <p>Ver todas tus reservas</p>
            </Link>

            <Link to="/salas" className="action-card">
              <span className="action-icon">🔍</span>
              <h3>Salas Disponibles</h3>
              <p>Explorar salas disponibles</p>
            </Link>
          </div>
        </div>

        {/* Últimas reservas */}
        <div className="recent-reservations">
          <div className="section-header">
            <h2>Últimas Reservas</h2>
            <Link to="/mis-reservas" className="view-all-link">
              Ver todas →
            </Link>
          </div>

          {reservas.length === 0 ? (
            <div className="empty-state">
              <p>No tienes reservas todavía</p>
              <Link to="/nueva-reserva" className="btn-primary">
                Crear tu primera reserva
              </Link>
            </div>
          ) : (
            <div className="reservations-list">
              {reservas.map(reserva => (
                <div key={reserva.id_reserva} className="reservation-item">
                  <div className="reservation-info">
                    <h3>{reserva.nombre_sala}</h3>
                    <p className="reservation-detail">
                      📍 {reserva.edificio} | 📅 {formatDate(reserva.fecha)}
                    </p>
                    <p className="reservation-detail">
                      ⏰ {formatTime(reserva.hora_inicio)} - {formatTime(reserva.hora_fin)}
                    </p>
                  </div>
                  <div 
                    className="reservation-status"
                    style={{ backgroundColor: getEstadoColor(reserva.estado) }}
                  >
                    {reserva.estado}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
