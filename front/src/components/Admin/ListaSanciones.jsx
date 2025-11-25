import { useState, useEffect } from "react";
import {
  obtenerSanciones,
  eliminarSancion,
  obtenerParticipantes,
} from "../../services/api";
import { formatDate } from "../../utils/helpers";
import Layout from "../Layout/Layout";
import "./ListaParticipantes.css";

const ListaSanciones = () => {
  const [sanciones, setSanciones] = useState([]);
  const [participantes, setParticipantes] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todas");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [sancionesData, participantesData] = await Promise.all([
        obtenerSanciones(),
        obtenerParticipantes(),
      ]);
      setSanciones(sancionesData);

      const mapParticipantes = {};
      participantesData.forEach((p) => {
        mapParticipantes[p.ci] = p;
      });
      setParticipantes(mapParticipantes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta sanción?")) return;
    try {
      await eliminarSancion(id);
      cargarDatos();
    } catch (error) {
      alert(error.message);
    }
  };

  const esSancionActiva = (fechaFin) => new Date(fechaFin) >= new Date();

  const getDiasRestantes = (fechaFin) => {
    const diff = Math.ceil(
      (new Date(fechaFin) - new Date()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 0;
  };

  const sancionesFiltradas = sanciones.filter((s) => {
    if (filtroEstado === "activas") return esSancionActiva(s.fecha_fin);
    if (filtroEstado === "finalizadas") return !esSancionActiva(s.fecha_fin);
    return true;
  });

  const sancionesActivas = sanciones.filter((s) =>
    esSancionActiva(s.fecha_fin),
  ).length;

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
          <h1>Gestión de Sanciones</h1>
          <button className="btn-primary">+ Nueva Sanción</button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}
            >
              {sanciones.length}
            </div>
            <div style={{ color: "#666", marginTop: "0.5rem" }}>
              Total Sanciones
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc3545" }}
            >
              {sancionesActivas}
            </div>
            <div style={{ color: "#666", marginTop: "0.5rem" }}>🚫 Activas</div>
          </div>
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#6c757d" }}
            >
              {sanciones.length - sancionesActivas}
            </div>
            <div style={{ color: "#666", marginTop: "0.5rem" }}>
              ✅ Finalizadas
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div
          style={{
            marginBottom: "1.5rem",
            background: "white",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <label style={{ marginRight: "1rem", fontWeight: "500" }}>
            Filtrar:
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          >
            <option value="todas">Todas</option>
            <option value="activas">Activas</option>
            <option value="finalizadas">Finalizadas</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Participante</th>
                <th>CI</th>
                <th>Email</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Días Restantes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sancionesFiltradas.map((s) => {
                const activa = esSancionActiva(s.fecha_fin);
                const participante = participantes[s.ci_participante];
                const diasRestantes = getDiasRestantes(s.fecha_fin);

                return (
                  <tr
                    key={s.id_sancion}
                    style={
                      activa ? { backgroundColor: "#fff3cd" } : { opacity: 0.6 }
                    }
                  >
                    <td>{s.id_sancion}</td>
                    <td>
                      {participante
                        ? `${participante.nombre} ${participante.apellido}`
                        : "Desconocido"}
                    </td>
                    <td>{s.ci_participante}</td>
                    <td>{participante?.email || "-"}</td>
                    <td>{formatDate(s.fecha_inicio)}</td>
                    <td>{formatDate(s.fecha_fin)}</td>
                    <td>
                      <span
                        style={{
                          padding: "0.375rem 0.75rem",
                          borderRadius: "12px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          backgroundColor: activa ? "#dc3545" : "#6c757d",
                          color: "white",
                        }}
                      >
                        {activa ? "🚫 Activa" : "✅ Finalizada"}
                      </span>
                    </td>
                    <td>
                      {activa ? (
                        <strong style={{ color: "#dc3545" }}>
                          {diasRestantes} días
                        </strong>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="actions">
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleEliminar(s.id_sancion)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {sancionesFiltradas.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#999" }}
            >
              No hay sanciones para mostrar
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ListaSanciones;
