import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { obtenerSalas } from '../../services/api';
import { getTipoSalaColor } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import { Loading, EmptyState } from '../Common';

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
      const data = await obtenerSalas();
      setSalas(data.filter(sala => canAccessSala(sala.tipo_sala)));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const salasFiltradas = salas.filter(sala => 
    filtro === 'todas' ? true : sala.tipo_sala === filtro
  );

  if (loading) {
    return (
      <Layout>
        <Loading />
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
            Uso Libre
          </button>
          {salas.some(s => s.tipo_sala === 'posgrado') && (
            <button 
              className={filtro === 'posgrado' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFiltro('posgrado')}
            >
              Posgrado
            </button>
          )}
          {salas.some(s => s.tipo_sala === 'docente') && (
            <button 
              className={filtro === 'docente' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFiltro('docente')}
            >
              Docentes
            </button>
          )}
        </div>

        {salasFiltradas.length === 0 ? (
          <EmptyState message="No hay salas disponibles" icon="🚪" />
        ) : (
          <div className="salas-grid">
            {salasFiltradas.map(sala => (
              <div key={`${sala.nombre_sala}-${sala.edificio}`} className="sala-card">
                <h3>{sala.nombre_sala}</h3>
                <p>📍 {sala.edificio}</p>
                <p>👥 Capacidad: {sala.capacidad}</p>
                <span 
                  className="tipo-badge"
                  style={{ backgroundColor: getTipoSalaColor(sala.tipo_sala) }}
                >
                  {sala.tipo_sala}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SalasDisponibles;
