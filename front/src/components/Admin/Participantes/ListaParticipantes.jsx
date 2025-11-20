import { useState, useEffect } from 'react';
import { obtenerParticipantes, eliminarParticipante } from '../../../services/api';
import Layout from '../../Layout/Layout';
import './ListaParticipantes.css';

const ListaParticipantes = () => {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarParticipantes();
  }, []);

  const cargarParticipantes = async () => {
    try {
      setLoading(true);
      const data = await obtenerParticipantes();
      setParticipantes(data);
    } catch (error) {
      mostrarMensaje('error', 'Error al cargar participantes');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (ci) => {
    if (!confirm('¿Estás seguro de eliminar este participante?')) return;

    try {
      await eliminarParticipante(ci);
      mostrarMensaje('success', 'Participante eliminado correctamente');
      cargarParticipantes();
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 4000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">Cargando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="lista-participantes">
        <div className="page-header">
          <h1>Gestión de Participantes</h1>
          <button className="btn-primary">+ Nuevo Participante</button>
        </div>

        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>CI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {participantes.map(p => (
                <tr key={p.ci}>
                  <td>{p.ci}</td>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.email}</td>
                  <td>
                    <button className="btn-edit">Editar</button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleEliminar(p.ci)}
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

export default ListaParticipantes;
