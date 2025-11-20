import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { obtenerSancionesPorParticipante } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import { Loading, Alert, EmptyState } from '../Common';

const MisSanciones = () => {
  const { user } = useAuth();
  const [sanciones, setSanciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSanciones();
  }, [user]);

  const cargarSanciones = async () => {
    try {
      if (user?.ci) {
        const data = await obtenerSancionesPorParticipante(user.ci);
        setSanciones(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSancionEstado = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    
    if (fin < hoy) {
      return { texto: 'Finalizada', clase: 'finalizada' };
    }
    
    const diasRestantes = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    return { 
      texto: `Activa (${diasRestantes} días restantes)`, 
      clase: 'activa' 
    };
  };

  const sancionesActivas = sanciones.filter(s => new Date(s.fecha_fin) >= new Date());

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mis-sanciones">
        <div className="page-header">
          <h1>Mis Sanciones</h1>
          <p>{sancionesActivas.length > 0 ? '⚠️ Tienes sanciones activas' : '✅ Sin sanciones'}</p>
        </div>

        {sancionesActivas.length > 0 ? (
          <>
            <Alert type="warning">
              <strong>Importante:</strong> No podrás realizar reservas mientras tengas sanciones activas.
            </Alert>

            <div className="sanciones-list">
              {sancionesActivas.map(sancion => {
                const estado = getSancionEstado(sancion.fecha_fin);
                return (
                  <div key={sancion.id_sancion} className="sancion-card">
                    <div className="sancion-header">
                      <h3>Sanción #{sancion.id_sancion}</h3>
                      <span className={`sancion-estado ${estado.clase}`}>{estado.texto}</span>
                    </div>
                    <div className="sancion-body">
                      <p>📅 <strong>Desde:</strong> {formatDate(sancion.fecha_inicio)}</p>
                      <p>📅 <strong>Hasta:</strong> {formatDate(sancion.fecha_fin)}</p>
                      {sancion.motivo && <p>💬 <strong>Motivo:</strong> {sancion.motivo}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <Alert type="success">
            <h3>¡Excelente! 🎉</h3>
            <p>No tienes sanciones. Recuerda asistir siempre a tus reservas.</p>
          </Alert>
        )}

        <Alert type="info">
          <h3>ℹ️ Información sobre sanciones</h3>
          <ul>
            <li>Se aplican cuando no asistes a una reserva sin cancelarla</li>
            <li>La duración es de 2 meses desde la fecha de inicio</li>
            <li>Durante la sanción no podrás crear nuevas reservas</li>
          </ul>
        </Alert>
      </div>
    </Layout>
  );
};

export default MisSanciones;
