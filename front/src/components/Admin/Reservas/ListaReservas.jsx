import { useState, useEffect } from 'react';
import { obtenerReservas, cancelarReserva } from '../../../services/api';
import { formatDate, formatTime, getEstadoColor } from '../../../utils/helpers';
import Layout from '../../Layout/Layout';
import '../Participantes/ListaParticipantes.css';

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const data = await obtenerReservas();
      setReservas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    try {
      await cancelarReserva(id);
      cargarReservas();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <Layout><div className="loading-container">Cargando...</div></Layout>;

  return (
    <Layout>
      <div className="lista-participantes">
        <div className="page-header">
          <h1>Gestión de Reservas</h1>
          <button className="btn-primary">+ Nueva Reserva</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sala</th>
                <th>Edificio</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(r => (
                <tr key={r.id_reserva}>
                  <td>{r.id_reserva}</td>
                  <td>{r.nombre_sala}</td>
                  <td>{r.edificio}</td>
                  <td>{formatDate(r.fecha)}</td>
                  <td>{formatTime(r.hora_inicio)} - {formatTime(r.hora_fin)}</td>
                  <td>
                    <span 
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '12px',
                        backgroundColor: getEstadoColor(r.estado)
                      }}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit">Ver</button>
                    {r.estado === 'activa' && (
                      <button 
                        className="btn-delete"
                        onClick={() => handleCancelar(r.id_reserva)}
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ListaReservas;
