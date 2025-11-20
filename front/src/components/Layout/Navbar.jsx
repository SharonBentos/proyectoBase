import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to={isAdmin() ? '/admin' : '/dashboard'}>
            🏛️ UCU Salas
          </Link>
        </div>

        <div className="navbar-menu">
          {isAdmin() ? (
            // Menú de Administrador
            <>
              <Link to="/admin" className="navbar-link">
                📊 Dashboard
              </Link>
              <Link to="/admin/participantes" className="navbar-link">
                👥 Participantes
              </Link>
              <Link to="/admin/salas" className="navbar-link">
                🚪 Salas
              </Link>
              <Link to="/admin/reservas" className="navbar-link">
                📅 Reservas
              </Link>
              <Link to="/admin/sanciones" className="navbar-link">
                ⚠️ Sanciones
              </Link>
            </>
          ) : (
            // Menú de Usuario Normal
            <>
              <Link to="/dashboard" className="navbar-link">
                🏠 Inicio
              </Link>
              <Link to="/mis-reservas" className="navbar-link">
                📋 Mis Reservas
              </Link>
              <Link to="/nueva-reserva" className="navbar-link">
                ➕ Nueva Reserva
              </Link>
              <Link to="/salas" className="navbar-link">
                🚪 Salas
              </Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-info">
            {user?.correo || 'Usuario'}
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
