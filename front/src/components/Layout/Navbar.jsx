import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { obtenerSancionesPorParticipante } from "../../services/api";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tieneSancion, setTieneSancion] = useState(false);

  useEffect(() => {
    if (user?.ci && !isAdmin()) {
      verificarSanciones();
    }
  }, [user]);

  const verificarSanciones = async () => {
    try {
      const sanciones = await obtenerSancionesPorParticipante(user.ci);
      const hoy = new Date();
      const tieneActiva = sanciones.some((s) => new Date(s.fecha_fin) >= hoy);
      setTieneSancion(tieneActiva);
    } catch (error) {
      console.error("Error al verificar sanciones:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNuevaReserva = (e) => {
    if (tieneSancion) {
      e.preventDefault();
      alert(
        "No puedes crear reservas mientras tengas sanciones activas. Revisa tu dashboard para más información.",
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to={isAdmin() ? "/admin" : "/dashboard"}>UCU Salas</Link>
        </div>

        <div className="navbar-menu">
          {isAdmin() ? (
            // Menú de Administrador
            <>
              <Link to="/admin" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/admin/participantes" className="navbar-link">
                Participantes
              </Link>
              <Link to="/admin/salas" className="navbar-link">
                Salas
              </Link>
              <Link to="/admin/reservas" className="navbar-link">
                Reservas
              </Link>
              <Link to="/admin/sanciones" className="navbar-link">
                Sanciones
              </Link>
              <Link to="/admin/metricas" className="navbar-link">
                Métricas
              </Link>
            </>
          ) : (
            // Menú de Usuario Normal
            <>
              <Link to="/dashboard" className="navbar-link">
                Inicio
              </Link>
              <Link to="/mis-reservas" className="navbar-link">
                Mis Reservas
              </Link>
              <Link
                to="/nueva-reserva"
                className={`navbar-link ${tieneSancion ? "disabled" : ""}`}
                onClick={handleNuevaReserva}
              >
                Nueva Reserva
              </Link>
              <Link to="/salas" className="navbar-link">
                Salas
              </Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-info">
            {user?.correo || "Usuario"}
            {isAdmin() && <span className="admin-badge">Admin</span>}
          </span>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
