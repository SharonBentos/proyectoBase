import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { obtenerSancionesPorParticipante } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import './MisSanciones.css';

const MisSanciones = () => {
  const { user } = useAuth();
  const [sanciones, setSanciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSanciones();
  }, [user]);

  const cargarSanciones = async () => {
    try {
      setLoading(true);
      if (user?.ci) {
        const data = await obtenerSancionesPorParticipante(user.ci);
        setSanciones(data);
      }
    } catch (error) {
      console.error('Error al cargar sanciones:', error);
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
  const sancionesHistoricas = sanciones.filter(s => new Date(s.fecha_fin) < new Date());

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">Cargando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mis-sanciones">
        <div className="page-header">
          <h1>Mis Sanciones</h1>
          <p className="subtitle">
            {sancionesActivas.length > 0 
              ? '⚠️ Tienes sanciones activas que te impiden hacer reservas'
              : '✅ No tienes sanciones activas'
            }
          </p>
        </div>

        {sancionesActivas.length > 0 && (
          <div className="sanciones-activas">
            <h2>🚫 Sanciones Activas</h2>
            <div className="info-box warning">
              <p><strong>Importante:</strong> Mientras tengas sanciones activas no podrás realizar nuevas reservas.</p>
              <p>Las sanciones se aplican por no asistir a reservas confirmadas.</p>
            </div>

            <div className="sanciones-list">
              {sancionesActivas.map(sancion => {
                const estado = getSancionEstado(sancion.fecha_fin);
                return (
                  <div key={sancion.id_sancion} className="sancion-card activa">
                    <div className="sancion-header">
                      <span className="sancion-id">Sanción #{sancion.id_sancion}</span>
                      <span className={`sancion-estado ${estado.clase}`}>{estado.texto}</span>
                    </div>
                    <div className="sancion-body">
                      <div className="sancion-fechas">
                        <div className="fecha-item">
                          <span className="label">Desde:</span>
                          <span className="valor">{formatDate(sancion.fecha_inicio)}</span>
                        </div>
                        <div className="fecha-item">
                          <span className="label">Hasta:</span>
                          <span className="valor destacado">{formatDate(sancion.fecha_fin)}</span>
                        </div>
                      </div>
                      {sancion.motivo && (
                        <div className="sancion-motivo">
                          <span className="label">Motivo:</span>
                          <p>{sancion.motivo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sancionesHistoricas.length > 0 && (
          <div className="sanciones-historicas">
            <h2>📋 Historial de Sanciones</h2>
            <div className="sanciones-list">
              {sancionesHistoricas.map(sancion => {
                const estado = getSancionEstado(sancion.fecha_fin);
                return (
                  <div key={sancion.id_sancion} className="sancion-card historica">
                    <div className="sancion-header">
                      <span className="sancion-id">Sanción #{sancion.id_sancion}</span>
                      <span className={`sancion-estado ${estado.clase}`}>{estado.texto}</span>
                    </div>
                    <div className="sancion-body">
                      <div className="sancion-fechas">
                        <div className="fecha-item">
                          <span className="label">Desde:</span>
                          <span className="valor">{formatDate(sancion.fecha_inicio)}</span>
                        </div>
                        <div className="fecha-item">
                          <span className="label">Hasta:</span>
                          <span className="valor">{formatDate(sancion.fecha_fin)}</span>
                        </div>
                      </div>
                      {sancion.motivo && (
                        <div className="sancion-motivo">
                          <span className="label">Motivo:</span>
                          <p>{sancion.motivo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sanciones.length === 0 && (
          <div className="info-box success">
            <h3>¡Excelente comportamiento! 🎉</h3>
            <p>No tienes ninguna sanción en tu historial.</p>
            <p>Recuerda siempre asistir a tus reservas o cancelarlas con anticipación.</p>
          </div>
        )}

        <div className="info-box info">
          <h3>ℹ️ ¿Por qué recibo sanciones?</h3>
          <ul>
            <li>No asistir a una reserva sin cancelarla previamente</li>
            <li>Ningún participante de la reserva se presenta en el horario establecido</li>
            <li>Uso indebido de las instalaciones</li>
          </ul>
          <p><strong>Duración típica:</strong> 2 meses sin poder realizar reservas</p>
        </div>
      </div>
    </Layout>
  );
};

export default MisSanciones;
