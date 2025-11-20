import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { obtenerReservas, cancelarReserva, registrarAsistencia } from '../../services/api';
import { formatDate, formatTime, getEstadoColor, isToday } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import './MisReservas.css';

const MisReservas = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('todas'); // todas, activas, pasadas
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarReservas();
  }, [user]);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const todasReservas = await obtenerReservas();
      const misReservas = todasReservas.filter(r => 
        r.participantes_ci?.includes(user?.ci)
      );
      setReservas(misReservas);
    } catch (error) {
      mostrarMensaje('error', 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (idReserva) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    try {
      await cancelarReserva(idReserva);
      mostrarMensaje('success', 'Reserva cancelada correctamente');
      cargarReservas();
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const handleRegistrarAsistencia = async (idReserva) => {
    try {
      await registrarAsistencia(idReserva, user.ci, true);
      mostrarMensaje('success', 'Asistencia registrada correctamente');
      cargarReservas();
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 4000);
  };

  const reservasFiltradas = reservas.filter(r => {
    if (filtro === 'activas') return r.estado === 'activa';
    if (filtro === 'pasadas') return r.estado !== 'activa';
    return true;
  });

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
      <div className="mis-reservas">
        <div className="page-header">
          <h1>Mis Reservas</h1>
          <p>Gestiona todas tus reservas de salas de estudio</p>
        </div>

        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <div className="filters">
          <button 
            className={filtro === 'todas' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('todas')}
          >
            Todas ({reservas.length})
          </button>
          <button 
            className={filtro === 'activas' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('activas')}
          >
            Activas ({reservas.filter(r => r.estado === 'activa').length})
          </button>
          <button 
            className={filtro === 'pasadas' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('pasadas')}
          >
            Pasadas ({reservas.filter(r => r.estado !== 'activa').length})
          </button>
        </div>

        {reservasFiltradas.length === 0 ? (
          <div className="empty-state">
            <p>No tienes reservas {filtro !== 'todas' ? filtro : ''}</p>
          </div>
        ) : (
          <div className="reservas-grid">
            {reservasFiltradas.map(reserva => (
              <div key={reserva.id_reserva} className="reserva-card">
                <div className="reserva-header">
                  <h3>{reserva.nombre_sala}</h3>
                  <span 
                    className="estado-badge"
                    style={{ backgroundColor: getEstadoColor(reserva.estado) }}
                  >
                    {reserva.estado}
                  </span>
                </div>

                <div className="reserva-details">
                  <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <span>{reserva.edificio}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <span>{formatDate(reserva.fecha)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">⏰</span>
                    <span>
                      {formatTime(reserva.hora_inicio)} - {formatTime(reserva.hora_fin)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">👥</span>
                    <span>{reserva.participantes_ci?.length || 0} participantes</span>
                  </div>
                </div>

                <div className="reserva-actions">
                  {reserva.estado === 'activa' && (
                    <>
                      {isToday(reserva.fecha) && !reserva.asistencia && (
                        <button 
                          className="btn-success"
                          onClick={() => handleRegistrarAsistencia(reserva.id_reserva)}
                        >
                          ✓ Registrar Asistencia
                        </button>
                      )}
                      <button 
                        className="btn-danger"
                        onClick={() => handleCancelar(reserva.id_reserva)}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {reserva.asistencia && (
                    <span className="asistencia-badge">✓ Asistencia registrada</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MisReservas;
