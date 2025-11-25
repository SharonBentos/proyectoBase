import { useState, useEffect } from "react";
import {
  obtenerReservas,
  cancelarReserva,
  crearReserva,
  obtenerSalas,
  obtenerTurnos,
  obtenerParticipantes,
} from "../../services/api";
import {
  formatDate,
  formatTime,
  getEstadoColor,
  getTodayString,
} from "../../utils/helpers";
import Layout from "../Layout/Layout";
import "./ListaParticipantes.css";

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(null);

  // Para crear reserva
  const [salas, setSalas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [formData, setFormData] = useState({
    nombre_sala: "",
    edificio: "",
    fecha: getTodayString(),
    id_turno: "",
    participantes_ci: [],
  });
  const [participanteSeleccionado, setParticipanteSeleccionado] = useState("");

  useEffect(() => {
    cargarReservas();
    cargarDatosAuxiliares();
  }, []);

  const cargarDatosAuxiliares = async () => {
    try {
      const [salasData, turnosData, participantesData] = await Promise.all([
        obtenerSalas(),
        obtenerTurnos(),
        obtenerParticipantes(),
      ]);
      setSalas(salasData);
      setTurnos(turnosData);
      setParticipantes(participantesData);
    } catch (error) {
      console.error("Error al cargar datos auxiliares:", error);
    }
  };

  const cargarReservas = async () => {
    try {
      const data = await obtenerReservas();
      setReservas(data);
    } catch (error) {
      mostrarMensaje("error", "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    try {
      await cancelarReserva(id);
      mostrarMensaje("success", "Reserva cancelada correctamente");
      cargarReservas();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const abrirModalNuevo = () => {
    setFormData({
      nombre_sala: "",
      edificio: "",
      fecha: getTodayString(),
      id_turno: "",
      participantes_ci: [],
    });
    setParticipanteSeleccionado("");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFormData({
      nombre_sala: "",
      edificio: "",
      fecha: getTodayString(),
      id_turno: "",
      participantes_ci: [],
    });
    setParticipanteSeleccionado("");
  };

  const handleSalaChange = (e) => {
    const [nombreSala, edificio] = e.target.value.split("|");
    setFormData({
      ...formData,
      nombre_sala: nombreSala,
      edificio: edificio,
    });
  };

  const agregarParticipante = () => {
    if (!participanteSeleccionado) {
      mostrarMensaje("error", "Selecciona un participante");
      return;
    }
    if (formData.participantes_ci.includes(participanteSeleccionado)) {
      mostrarMensaje("error", "Participante ya agregado");
      return;
    }
    setFormData({
      ...formData,
      participantes_ci: [
        ...formData.participantes_ci,
        participanteSeleccionado,
      ],
    });
    setParticipanteSeleccionado("");
  };

  const quitarParticipante = (ci) => {
    setFormData({
      ...formData,
      participantes_ci: formData.participantes_ci.filter((p) => p !== ci),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre_sala) {
      mostrarMensaje("error", "Selecciona una sala");
      return;
    }
    if (!formData.id_turno) {
      mostrarMensaje("error", "Selecciona un turno");
      return;
    }
    if (formData.participantes_ci.length === 0) {
      mostrarMensaje("error", "Agrega al menos un participante");
      return;
    }

    try {
      await crearReserva({
        nombre_sala: formData.nombre_sala,
        edificio: formData.edificio,
        fecha: formData.fecha,
        id_turno: parseInt(formData.id_turno),
        participantes_ci: formData.participantes_ci,
      });
      mostrarMensaje("success", "Reserva creada correctamente");
      cerrarModal();
      cargarReservas();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const verDetalles = (reserva) => {
    setMostrarDetalles(reserva);
  };

  const cerrarDetalles = () => {
    setMostrarDetalles(null);
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
          <h1>Gestión de Reservas</h1>
          <button className="btn-primary" onClick={abrirModalNuevo}>
            + Nueva Reserva
          </button>
        </div>

        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

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
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>{r.id_reserva}</td>
                  <td>{r.nombre_sala}</td>
                  <td>{r.edificio}</td>
                  <td>{formatDate(r.fecha)}</td>
                  <td>
                    {formatTime(r.hora_inicio)} - {formatTime(r.hora_fin)}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "12px",
                        backgroundColor: getEstadoColor(r.estado),
                      }}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => verDetalles(r)}>
                      Ver
                    </button>
                    {r.estado === "activa" && (
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

        {/* Modal para crear reserva */}
        {mostrarModal && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div
              className="modal-content modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Nueva Reserva</h2>
                <button className="btn-close" onClick={cerrarModal}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Sala *</label>
                  <select
                    value={
                      formData.nombre_sala && formData.edificio
                        ? `${formData.nombre_sala}|${formData.edificio}`
                        : ""
                    }
                    onChange={handleSalaChange}
                    required
                  >
                    <option value="">-- Selecciona una sala --</option>
                    {salas.map((sala) => (
                      <option
                        key={`${sala.nombre_sala}-${sala.edificio}`}
                        value={`${sala.nombre_sala}|${sala.edificio}`}
                      >
                        {sala.nombre_sala} - {sala.edificio} (Cap:{" "}
                        {sala.capacidad})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    min={getTodayString()}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Turno *</label>
                  <select
                    value={formData.id_turno}
                    onChange={(e) =>
                      setFormData({ ...formData, id_turno: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Selecciona un turno --</option>
                    {turnos.map((turno) => (
                      <option key={turno.id_turno} value={turno.id_turno}>
                        {turno.hora_inicio.substring(0, 5)} -{" "}
                        {turno.hora_fin.substring(0, 5)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Participantes *</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <select
                      value={participanteSeleccionado}
                      onChange={(e) =>
                        setParticipanteSeleccionado(e.target.value)
                      }
                      style={{ flex: 1 }}
                    >
                      <option value="">-- Selecciona un participante --</option>
                      {participantes.map((p) => (
                        <option key={p.ci} value={p.ci}>
                          {p.nombre} {p.apellido} ({p.ci})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={agregarParticipante}
                    >
                      Agregar
                    </button>
                  </div>

                  {formData.participantes_ci.length > 0 && (
                    <div className="participantes-chips">
                      {formData.participantes_ci.map((ci) => {
                        const p = participantes.find((part) => part.ci === ci);
                        return (
                          <div key={ci} className="participante-chip">
                            <span>
                              {p?.nombre} {p?.apellido}
                            </span>
                            <button
                              type="button"
                              className="btn-chip-remove"
                              onClick={() => quitarParticipante(ci)}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                    Crear Reserva
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {mostrarDetalles && (
          <div className="modal-overlay" onClick={cerrarDetalles}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Detalles de Reserva #{mostrarDetalles.id_reserva}</h2>
                <button className="btn-close" onClick={cerrarDetalles}>
                  ×
                </button>
              </div>
              <div style={{ padding: "24px" }}>
                <div className="detalle-item">
                  <strong>Sala:</strong> {mostrarDetalles.nombre_sala} -{" "}
                  {mostrarDetalles.edificio}
                </div>
                <div className="detalle-item">
                  <strong>Fecha:</strong> {formatDate(mostrarDetalles.fecha)}
                </div>
                <div className="detalle-item">
                  <strong>Horario:</strong>{" "}
                  {formatTime(mostrarDetalles.hora_inicio)} -{" "}
                  {formatTime(mostrarDetalles.hora_fin)}
                </div>
                <div className="detalle-item">
                  <strong>Estado:</strong>{" "}
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "12px",
                      backgroundColor: getEstadoColor(mostrarDetalles.estado),
                    }}
                  >
                    {mostrarDetalles.estado}
                  </span>
                </div>

                {mostrarDetalles.participantes &&
                  mostrarDetalles.participantes.length > 0 && (
                    <div className="detalle-item">
                      <strong>Participantes:</strong>
                      <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                        {mostrarDetalles.participantes.map((p) => (
                          <li key={p.ci}>
                            {p.nombre} {p.apellido} - {p.email}
                            {p.asistencia ? " ✓" : " (Pendiente)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ListaReservas;
