import { useState, useEffect } from 'react';
import { obtenerSalas, eliminarSala } from '../../../services/api';
import Layout from '../../Layout/Layout';
import '../Participantes/ListaParticipantes.css';

const ListaSalas = () => {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSalas();
  }, []);

  const cargarSalas = async () => {
    try {
      const data = await obtenerSalas();
      setSalas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (nombreSala, edificio) => {
    if (!confirm('¿Eliminar esta sala?')) return;
    try {
      await eliminarSala(nombreSala, edificio);
      cargarSalas();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <Layout><div className="loading-container">Cargando...</div></Layout>;

  return (
    <Layout>
      <div className="lista-participantes">
        <div className="page-header">
          <h1>Gestión de Salas</h1>
          <button className="btn-primary">+ Nueva Sala</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Edificio</th>
                <th>Capacidad</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {salas.map(s => (
                <tr key={`${s.nombre_sala}-${s.edificio}`}>
                  <td>{s.nombre_sala}</td>
                  <td>{s.edificio}</td>
                  <td>{s.capacidad}</td>
                  <td>{s.tipo_sala}</td>
                  <td>
                    <button className="btn-edit">Editar</button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleEliminar(s.nombre_sala, s.edificio)}
                    >
                      Eliminar
                    </button>
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

export default ListaSalas;
