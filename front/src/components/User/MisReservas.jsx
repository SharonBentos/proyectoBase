import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { obtenerReservas, cancelarReserva, registrarAsistencia } from '../../services/api';
import { formatDate, formatTime, getEstadoColor, isToday } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import { Alert, Loading, Button, EmptyState } from '../Common';

const MisReservas = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarReservas();
  }, [user]);

  const cargarReservas = async () => {
    try {
      const todasReservas = await obtenerReservas();
      setReservas(todasReservas.filter(r => r.participantes_ci?.includes(user?.ci)));
    } catch (error) {
      mostrarMensaje('error', 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (idReserva) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    
    try {
      await cancelarReserva(idReserva);
      mostrarMensaje('success', 'Reserva cancelada');
      cargarReservas();
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const handleRegistrarAsistencia = async (idReserva) => {
    try {
      await registrarAsistencia(idReserva, user.ci, true);
      mostrarMensaje('success', 'Asistencia registrada');
      cargarReservas();
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const reservasFiltradas = reservas.filter(r => {
    if (filtro === 'activas') return r.estado === 'activa';
    if (filtro === 'pasadas') return r.estado !== 'activa';
    return true;
  });

  if (loading) {
    return (
      <Layout>
        <Loading />
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
          <Alert type={mensaje.tipo}>
            {mensaje.texto}
          </Alert>
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
          <EmptyState 
            message={`No tienes reservas${filtro !== 'todas' ? ' ' + filtro : ''}`}
            icon="📋"
          />
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
                  <p>📍 {reserva.edificio}</p>
                  <p>📅 {formatDate(reserva.fecha)}</p>
                  <p>⏰ {formatTime(reserva.hora_inicio)} - {formatTime(reserva.hora_fin)}</p>
                  <p>👥 {reserva.participantes_ci?.length || 0} participantes</p>
                </div>

                {reserva.estado === 'activa' && (
                  <div className="reserva-actions">
                    {isToday(reserva.fecha) && !reserva.asistencia && (
                      <Button 
                        variant="success"
                        onClick={() => handleRegistrarAsistencia(reserva.id_reserva)}
                      >
                        ✓ Asistencia
                      </Button>
                    )}
                    <Button 
                      variant="danger"
                      onClick={() => handleCancelar(reserva.id_reserva)}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MisReservas;
