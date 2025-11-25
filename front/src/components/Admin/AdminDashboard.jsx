import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerEstadisticas } from "../../services/api";
import Layout from "../Layout/Layout";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalParticipantes: 0,
    totalSalas: 0,
    reservasActivas: 0,
    sancionesActivas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await obtenerEstadisticas();
      setStats(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      // Datos por defecto si falla
      setStats({
        totalParticipantes: 0,
        totalSalas: 0,
        reservasActivas: 0,
        sancionesActivas: 0,
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Panel de Administración</h1>
          <p>Gestiona todos los aspectos del sistema de reservas</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalParticipantes}</h3>
              <p>Participantes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚪</div>
            <div className="stat-content">
              <h3>{stats.totalSalas}</h3>
              <p>Salas</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.reservasActivas}</h3>
              <p>Reservas Activas</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{stats.sancionesActivas}</h3>
              <p>Sanciones Activas</p>
            </div>
          </div>
        </div>

        <div className="admin-sections">
          <h2>Gestión del Sistema</h2>
          <div className="sections-grid">
            <Link to="/admin/participantes" className="section-card">
              <span className="section-icon">👥</span>
              <h3>Participantes</h3>
              <p>Alta, baja y modificación de estudiantes y docentes</p>
              <span className="section-arrow">→</span>
            </Link>

            <Link to="/admin/salas" className="section-card">
              <span className="section-icon">🚪</span>
              <h3>Salas</h3>
              <p>Gestión de salas de estudio y sus características</p>
              <span className="section-arrow">→</span>
            </Link>

            <Link to="/admin/reservas" className="section-card">
              <span className="section-icon">📅</span>
              <h3>Reservas</h3>
              <p>Ver y administrar todas las reservas del sistema</p>
              <span className="section-arrow">→</span>
            </Link>

            <Link to="/admin/sanciones" className="section-card">
              <span className="section-icon">⚠️</span>
              <h3>Sanciones</h3>
              <p>Gestión de sanciones a participantes</p>
              <span className="section-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
