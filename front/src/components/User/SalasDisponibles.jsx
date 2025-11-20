import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { obtenerSalas } from '../../services/api';
import { getTipoSalaColor } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import './SalasDisponibles.css';

const SalasDisponibles = () => {
  const { canAccessSala } = useAuth();
  const [salas, setSalas] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSalas();
  }, []);

  const cargarSalas = async () => {
    try {
      setLoading(true);
      const data = await obtenerSalas();
      // Filtrar por permisos
      const salasPermitidas = data.filter(sala => canAccessSala(sala.tipo_sala));
      setSalas(salasPermitidas);
    } catch (error) {
      console.error('Error al cargar salas:', error);
    } finally {
      setLoading(false);
    }
  };

  const salasFiltradas = salas.filter(sala => {
    if (filtro === 'todas') return true;
    return sala.tipo_sala === filtro;
  });

  // Agrupar por edificio
  const salasAgrupadas = salasFiltradas.reduce((acc, sala) => {
    if (!acc[sala.edificio]) {
      acc[sala.edificio] = [];
    }
    acc[sala.edificio].push(sala);
    return acc;
  }, {});

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
      <div className="salas-disponibles">
        <div className="page-header">
          <h1>Salas Disponibles</h1>
          <p>Explora las salas de estudio que puedes reservar</p>
        </div>

        <div className="filters">
          <button 
            className={filtro === 'todas' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('todas')}
          >
            Todas ({salas.length})
          </button>
          <button 
            className={filtro === 'libre' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('libre')}
          >
            Uso Libre ({salas.filter(s => s.tipo_sala === 'libre').length})
          </button>
          {salas.some(s => s.tipo_sala === 'posgrado') && (
            <button 
              className={filtro === 'posgrado' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFiltro('posgrado')}
            >
              Posgrado ({salas.filter(s => s.tipo_sala === 'posgrado').length})
            </button>
          )}
          {salas.some(s => s.tipo_sala === 'docente') && (
            <button 
              className={filtro === 'docente' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFiltro('docente')}
            >
              Docentes ({salas.filter(s => s.tipo_sala === 'docente').length})
            </button>
          )}
        </div>

        {Object.keys(salasAgrupadas).map(edificio => (
          <div key={edificio} className="edificio-section">
            <h2 className="edificio-title">🏢 {edificio}</h2>
            <div className="salas-grid">
              {salasAgrupadas[edificio].map(sala => (
                <div key={`${sala.nombre_sala}-${sala.edificio}`} className="sala-card">
                  <div className="sala-header">
                    <h3>{sala.nombre_sala}</h3>
                    <span 
                      className="tipo-badge"
                      style={{ backgroundColor: getTipoSalaColor(sala.tipo_sala) }}
                    >
                      {sala.tipo_sala}
                    </span>
                  </div>
                  <div className="sala-info">
                    <div className="info-item">
                      <span className="info-icon">👥</span>
                      <span>Capacidad: {sala.capacidad}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span>{sala.edificio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {salasFiltradas.length === 0 && (
          <div className="empty-state">
            <p>No hay salas disponibles con estos filtros</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SalasDisponibles;
