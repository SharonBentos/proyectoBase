import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/Auth/PrivateRoute";

// Auth
import Login from "./components/Auth/Login";

// User Components
import Dashboard from "./components/User/Dashboard";
import MisReservas from "./components/User/MisReservas";
import NuevaReserva from "./components/User/NuevaReserva";
import MisSanciones from "./components/User/MisSanciones";
import SalasDisponibles from "./components/User/SalasDisponibles";

// Admin Components
import AdminDashboard from "./components/Admin/AdminDashboard";
import ListaParticipantes from "./components/Admin/ListaParticipantes";
import ListaSalas from "./components/Admin/ListaSalas";
import ListaReservas from "./components/Admin/ListaReservas";
import ListaSanciones from "./components/Admin/ListaSanciones";
import PaginaMetricas from "./components/Admin/PaginaMetricas";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />

          {/* Rutas de usuario normal */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/mis-reservas"
            element={
              <PrivateRoute>
                <MisReservas />
              </PrivateRoute>
            }
          />
          <Route
            path="/nueva-reserva"
            element={
              <PrivateRoute>
                <NuevaReserva />
              </PrivateRoute>
            }
          />
          <Route
            path="/salas"
            element={
              <PrivateRoute>
                <SalasDisponibles />
              </PrivateRoute>
            }
          />

          {/* Rutas de administrador */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requireAdmin={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/participantes"
            element={
              <PrivateRoute requireAdmin={true}>
                <ListaParticipantes />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/salas"
            element={
              <PrivateRoute requireAdmin={true}>
                <ListaSalas />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reservas"
            element={
              <PrivateRoute requireAdmin={true}>
                <ListaReservas />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/sanciones"
            element={
              <PrivateRoute requireAdmin={true}>
                <ListaSanciones />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/metricas"
            element={
              <PrivateRoute requireAdmin={true}>
                <PaginaMetricas />
              </PrivateRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
