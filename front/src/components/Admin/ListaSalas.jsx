import { useState, useEffect } from "react";
import {
  obtenerSalas,
  eliminarSala,
  crearSala,
  actualizarSala,
} from "../../services/api";
import Layout from "../Layout/Layout";
import "./ListaParticipantes.css";

const ListaSalas = () => {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre_sala: "",
    edificio: "",
    capacidad: "",
    tipo_sala: "libre",
  });

  useEffect(() => {
    cargarSalas();
  }, []);

  const cargarSalas = async () => {
    try {
      const data = await obtenerSalas();
      setSalas(data);
    } catch (error) {
      mostrarMensaje("error", "Error al cargar salas");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (nombreSala, edificio) => {
    if (!confirm("¿Eliminar esta sala?")) return;
    try {
      await eliminarSala(nombreSala, edificio);
      mostrarMensaje("success", "Sala eliminada correctamente");
      cargarSalas();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const abrirModalNuevo = () => {
    setEditando(null);
    setFormData({
      nombre_sala: "",
      edificio: "",
      capacidad: "",
      tipo_sala: "libre",
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (sala) => {
    setEditando({ nombre: sala.nombre_sala, edificio: sala.edificio });
    setFormData({
      nombre_sala: sala.nombre_sala,
      edificio: sala.edificio,
      capacidad: sala.capacidad,
      tipo_sala: sala.tipo_sala,
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setFormData({
      nombre_sala: "",
      edificio: "",
      capacidad: "",
      tipo_sala: "libre",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await actualizarSala(editando.nombre, editando.edificio, {
          capacidad: parseInt(formData.capacidad),
          tipo_sala: formData.tipo_sala,
        });
        mostrarMensaje("success", "Sala actualizada correctamente");
      } else {
        await crearSala({
          ...formData,
          capacidad: parseInt(formData.capacidad),
        });
        mostrarMensaje("success", "Sala creada correctamente");
      }
      cerrarModal();
      cargarSalas();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000);
  };

  if (loading)
    return (
      <Layout>
        <div className="loading-container">Cargando...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="lista-participantes">
        <div className="page-header">
          <h1>Gestión de Salas</h1>
          <button className="btn-primary" onClick={abrirModalNuevo}>
            + Nueva Sala
          </button>
        </div>

        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

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
              {salas.map((s) => (
                <tr key={`${s.nombre_sala}-${s.edificio}`}>
                  <td>{s.nombre_sala}</td>
                  <td>{s.edificio}</td>
                  <td>{s.capacidad}</td>
                  <td>{s.tipo_sala}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => abrirModalEditar(s)}
                    >
                      Editar
                    </button>
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

        {mostrarModal && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editando ? "Editar Sala" : "Nueva Sala"}</h2>
                <button className="btn-close" onClick={cerrarModal}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre de la Sala *</label>
                  <input
                    type="text"
                    value={formData.nombre_sala}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre_sala: e.target.value })
                    }
                    required
                    disabled={editando !== null}
                    placeholder="Sala 101"
                  />
                </div>
                <div className="form-group">
                  <label>Edificio *</label>
                  <input
                    type="text"
                    value={formData.edificio}
                    onChange={(e) =>
                      setFormData({ ...formData, edificio: e.target.value })
                    }
                    required
                    disabled={editando !== null}
                    placeholder="Polifuncional"
                  />
                </div>
                <div className="form-group">
                  <label>Capacidad *</label>
                  <input
                    type="number"
                    value={formData.capacidad}
                    onChange={(e) =>
                      setFormData({ ...formData, capacidad: e.target.value })
                    }
                    required
                    min="1"
                    placeholder="6"
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Sala *</label>
                  <select
                    value={formData.tipo_sala}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo_sala: e.target.value })
                    }
                    required
                  >
                    <option value="libre">Libre</option>
                    <option value="posgrado">Posgrado</option>
                    <option value="docente">Docente</option>
                  </select>
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

export default ListaSalas;
