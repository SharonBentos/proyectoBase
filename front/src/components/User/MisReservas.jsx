import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  obtenerReservas,
  cancelarReserva,
  registrarAsistencia,
  agregarParticipanteAReserva,
  eliminarParticipanteDeReserva,
  obtenerParticipantes,
} from "../../services/api";
import {
  formatDate,
  formatTime,
  getEstadoColor,
  isToday,
} from "../../utils/helpers";
import Layout from "../Layout/Layout";
import { Alert, Loading, Button, EmptyState } from "../Common";

const MisReservas = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [mostrandoFormulario, setMostrandoFormulario] = useState(null);
  const [todosParticipantes, setTodosParticipantes] = useState([]);
  const [ciNuevoParticipante, setCiNuevoParticipante] = useState("");

  useEffect(() => {
    cargarReservas();
    cargarParticipantes();
  }, [user]);

  const cargarReservas = async () => {
    try {
      const misReservas = await obtenerReservas(user?.ci);
      setReservas(misReservas);
    } catch (error) {
      mostrarMensaje("error", "Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const cargarParticipantes = async () => {
    try {
      const participantes = await obtenerParticipantes();
      setTodosParticipantes(participantes);
    } catch (error) {
      console.error("Error al cargar participantes:", error);
    }
  };

  const handleCancelar = async (idReserva) => {
    if (!confirm("¿Cancelar esta reserva?")) return;

    try {
      await cancelarReserva(idReserva);
      mostrarMensaje("success", "Reserva cancelada");
      cargarReservas();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const handleRegistrarAsistencia = async (idReserva) => {
    try {
      await registrarAsistencia(idReserva, user.ci, true);
      mostrarMensaje("success", "Asistencia registrada");
      cargarReservas();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const handleAgregarParticipante = async (idReserva) => {
    if (!ciNuevoParticipante.trim()) {
      mostrarMensaje("error", "Debe ingresar una cédula");
      return;
    }

    try {
      await agregarParticipanteAReserva(idReserva, ciNuevoParticipante.trim());
      mostrarMensaje("success", "Participante agregado");
      setCiNuevoParticipante("");
      setMostrandoFormulario(null);
      cargarReservas();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const toggleFormulario = (idReserva) => {
    if (mostrandoFormulario === idReserva) {
      setMostrandoFormulario(null);
      setCiNuevoParticipante("");
    } else {
      setMostrandoFormulario(idReserva);
    }
  };

  const handleEliminarParticipante = async (idReserva, ciParticipante) => {
    if (!confirm("¿Eliminar este participante de la reserva?")) return;

    try {
      await eliminarParticipanteDeReserva(idReserva, ciParticipante);
      mostrarMensaje("success", "Participante eliminado");
      cargarReservas();
    } catch (error) {
      mostrarMensaje("error", error.message);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
  };

  const reservasFiltradas = reservas.filter((r) => {
    if (filtro === "activas") return r.estado === "activa";
    if (filtro === "pasadas") return r.estado !== "activa";
    return true;
  });

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mis-reservas">
        <div className="page-header">
          <h1>Mis Reservas</h1>
          <p>Gestiona todas tus reservas de salas de estudio</p>
        </div>

        {mensaje.texto && <Alert type={mensaje.tipo}>{mensaje.texto}</Alert>}

        <div className="filters">
          <button
            className={filtro === "todas" ? "filter-btn active" : "filter-btn"}
            onClick={() => setFiltro("todas")}
          >
            Todas ({reservas.length})
          </button>
          <button
            className={
              filtro === "activas" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setFiltro("activas")}
          >
            Activas ({reservas.filter((r) => r.estado === "activa").length})
          </button>
          <button
            className={
              filtro === "pasadas" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setFiltro("pasadas")}
          >
            Pasadas ({reservas.filter((r) => r.estado !== "activa").length})
          </button>
        </div>

        {reservasFiltradas.length === 0 ? (
          <EmptyState
            message={`No tienes reservas${filtro !== "todas" ? " " + filtro : ""}`}
            icon="📋"
          />
        ) : (
          <div className="reservas-grid">
            {reservasFiltradas.map((reserva) => (
              <div key={reserva.id_reserva} className="reserva-card">
                <div className="reserva-header">
                  <h3>{reserva.nombre_sala}</h3>
                  <span
                    className="estado-badge"
                    style={{ backgroundColor: getEstadoColor(reserva.estado) }}
                  >
                    {reserva.estado}
                  </span>
                </div>

                <div className="reserva-details">
                  <p>📍 {reserva.edificio}</p>
                  <p>📅 {formatDate(reserva.fecha)}</p>
                  <p>
                    ⏰ {formatTime(reserva.hora_inicio)} -{" "}
                    {formatTime(reserva.hora_fin)}
                  </p>
                  <p>👥 {reserva.participantes?.length || 0} participantes</p>

                  {reserva.participantes &&
                    reserva.participantes.length > 0 && (
                      <div className="participantes-lista">
                        <strong>Participantes:</strong>
                        <ul>
                          {reserva.participantes.map((participante) => (
                            <li key={participante.ci}>
                              <div className="participante-info">
                                <span className="participante-nombre">
                                  {participante.nombre} {participante.apellido}
                                  {participante.ci === user?.ci && " (tú)"}
                                </span>
                                {participante.asistencia ? (
                                  <span className="asistencia-badge asistio">
                                    Asistió ✓
                                  </span>
                                ) : (
                                  <span className="asistencia-badge pendiente">
                                    Pendiente
                                  </span>
                                )}
                              </div>
                              {reserva.estado === "activa" &&
                                participante.ci !== user?.ci && (
                                  <button
                                    onClick={() =>
                                      handleEliminarParticipante(
                                        reserva.id_reserva,
                                        participante.ci,
                                      )
                                    }
                                    className="btn-eliminar-participante"
                                    title="Eliminar participante"
                                  >
                                    ✕
                                  </button>
                                )}
                            </li>
                          ))}
                        </ul>

                        {reserva.estado === "activa" && (
                          <>
                            <button
                              className="btn-toggle-form"
                              onClick={() =>
                                toggleFormulario(reserva.id_reserva)
                              }
                            >
                              {mostrandoFormulario === reserva.id_reserva
                                ? "✕ Cerrar"
                                : "➕ Añadir participante"}
                            </button>

                            {mostrandoFormulario === reserva.id_reserva && (
                              <div className="agregar-participante-form">
                                <input
                                  type="text"
                                  placeholder="Ingresa la CI del participante"
                                  value={ciNuevoParticipante}
                                  onChange={(e) =>
                                    setCiNuevoParticipante(e.target.value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAgregarParticipante(
                                        reserva.id_reserva,
                                      );
                                    }
                                  }}
                                  className="input-ci"
                                  autoFocus
                                />
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    handleAgregarParticipante(
                                      reserva.id_reserva,
                                    )
                                  }
                                  size="sm"
                                >
                                  Añadir
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                </div>

                {reserva.estado === "activa" && (
                  <div className="reserva-actions">
                    {isToday(reserva.fecha) && !reserva.asistencia && (
                      <Button
                        variant="success"
                        onClick={() =>
                          handleRegistrarAsistencia(reserva.id_reserva)
                        }
                      >
                        ✓ Asistencia
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      onClick={() => handleCancelar(reserva.id_reserva)}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MisReservas;
