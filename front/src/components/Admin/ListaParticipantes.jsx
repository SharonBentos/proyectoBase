import { useState, useEffect } from "react";
import {
  obtenerParticipantes,
  eliminarParticipante,
  crearParticipante,
  actualizarParticipante,
} from "../../services/api";
import Layout from "../Layout/Layout";
import "./ListaParticipantes.css";

const ListaParticipantes = () => {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    ci: "",
    nombre: "",
    apellido: "",
    email: "",
  });

  useEffect(() => {
    cargarParticipantes();
  }, []);

  const cargarParticipantes = async () => {
    try {
      setLoading(true);
      const data = await obtenerParticipantes();
      setParticipantes(data);
    } catch (error) {
      mostrarMensaje("error", "Error al cargar participantes");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (ci) => {
    if (!confirm("¿Estás seguro de eliminar este participante?")) return;

    try {
      await eliminarParticipante(ci);
      mostrarMensaje("success", "Participante eliminado correctamente");
      cargarParticipantes();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const abrirModalNuevo = () => {
    setEditando(null);
    setFormData({ ci: "", nombre: "", apellido: "", email: "" });
    setMostrarModal(true);
  };

  const abrirModalEditar = (participante) => {
    setEditando(participante.ci);
    setFormData({
      ci: participante.ci,
      nombre: participante.nombre,
      apellido: participante.apellido,
      email: participante.email,
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setFormData({ ci: "", nombre: "", apellido: "", email: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await actualizarParticipante(editando, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
        });
        mostrarMensaje("success", "Participante actualizado correctamente");
      } else {
        await crearParticipante(formData);
        mostrarMensaje("success", "Participante creado correctamente");
      }
      cerrarModal();
      cargarParticipantes();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000);
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
          <button className="btn-primary" onClick={abrirModalNuevo}>
            + Nuevo Participante
          </button>
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
              {participantes.map((p) => (
                <tr key={p.ci}>
                  <td>{p.ci}</td>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.email}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => abrirModalEditar(p)}
                    >
                      Editar
                    </button>
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

        {mostrarModal && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {editando ? "Editar Participante" : "Nuevo Participante"}
                </h2>
                <button className="btn-close" onClick={cerrarModal}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>CI *</label>
                  <input
                    type="text"
                    value={formData.ci}
                    onChange={(e) =>
                      setFormData({ ...formData, ci: e.target.value })
                    }
                    required
                    disabled={editando !== null}
                    placeholder="12345678"
                  />
                </div>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                    placeholder="Juan"
                  />
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) =>
                      setFormData({ ...formData, apellido: e.target.value })
                    }
                    required
                    placeholder="Pérez"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="juan.perez@example.com"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={cerrarModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editando ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ListaParticipantes;
