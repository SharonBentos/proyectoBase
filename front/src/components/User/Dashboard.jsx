import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { obtenerReservas, obtenerSancionesPorParticipante } from '../../services/api';
import { formatDate, formatTime, getEstadoColor, isInCurrentWeek } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import { Alert, Loading } from '../Common';

const Dashboard = () => {
  const { user } = useAuth();
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
      const [todasReservas, sancionesData] = await Promise.all([
        obtenerReservas(),
        user?.ci ? obtenerSancionesPorParticipante(user.ci) : Promise.resolve([])
      ]);

      const misReservas = todasReservas.filter(r => 
        r.participantes_ci?.includes(user?.ci)
      );
      
      setReservas(misReservas.slice(0, 5));
      
      const sancionesActivas = sancionesData.filter(s => 
        new Date(s.fecha_fin) >= new Date()
      );
      setSanciones(sancionesActivas);

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
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="page-header">
          <h1>Bienvenido, {user?.nombre}</h1>
        </div>

        {sanciones.length > 0 && (
          <Alert type="warning">
            <h3>⚠️ Tienes sanciones activas</h3>
            <p>No puedes realizar reservas hasta el {formatDate(sanciones[0].fecha_fin)}</p>
          </Alert>
        )}

        {/* Estadísticas */}
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
              <small>Máximo: 3 por semana</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>{stats.horasReservadasHoy}</h3>
              <p>Horas Hoy</p>
              <small>Máximo: 2 horas consecutivas</small>
            </div>
          </div>
        </div>

        <div className="recent-reservations">
          <div className="section-header">
            <h2>Últimas Reservas</h2>
            <Link to="/mis-reservas" className="view-all-link">Ver todas →</Link>
          </div>

          {reservas.length === 0 ? (
            <div className="empty-state">
              <p>No tienes reservas</p>
              {sanciones.length === 0 && (
                <Link to="/nueva-reserva" className="btn-primary">
                  Crear reserva
                </Link>
              )}
            </div>
          ) : (
            <div className="reservations-list">
              {reservas.map(reserva => (
                <div key={reserva.id_reserva} className="reservation-item">
                  <div className="reservation-info">
                    <h3>{reserva.nombre_sala}</h3>
                    <p>📍 {reserva.edificio} | 📅 {formatDate(reserva.fecha)}</p>
                    <p>⏰ {formatTime(reserva.hora_inicio)} - {formatTime(reserva.hora_fin)}</p>
                  </div>
                  <span 
                    className="estado-badge"
                    style={{ backgroundColor: getEstadoColor(reserva.estado) }}
                  >
                    {reserva.estado}
                  </span>
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
