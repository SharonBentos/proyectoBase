import { createContext, useState, useEffect } from 'react';
import { loginAPI, obtenerPerfilUsuario } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al parsear usuario del localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (correo, password) => {
    try {
      // MODO DESARROLLO: Datos mock mientras el backend implementa /login
      const usuariosMock = {
        'ana@uni.edu': { ci: '101', nombre: 'Ana', apellido: 'Pérez', correo: 'ana@uni.edu', es_administrador: false, rol: 'alumno', tipo_programa: 'grado' },
        'marta@uni.edu': { ci: '113', nombre: 'Marta', apellido: 'Gómez', correo: 'marta@uni.edu', es_administrador: false, rol: 'docente', tipo_programa: 'grado' },
        'olga@uni.edu': { ci: '115', nombre: 'Olga', apellido: 'Santos', correo: 'olga@uni.edu', es_administrador: false, rol: 'alumno', tipo_programa: 'posgrado' },
        'admin@uni.edu': { ci: '999', nombre: 'Admin', apellido: 'Sistema', correo: 'admin@uni.edu', es_administrador: true, rol: 'alumno', tipo_programa: 'grado' }
      };

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      if (usuariosMock[correo] && (password === 'p1' || password === 'p13' || password === 'p15' || password === 'admin123')) {
        const userData = usuariosMock[correo];
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        throw new Error('Credenciales inválidas');
      }

      // PRODUCCIÓN: Descomentar cuando el backend tenga /login
      // const userData = await loginAPI(correo, password);
      // setUser(userData);
      // localStorage.setItem('user', JSON.stringify(userData));
      // return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Funciones de permisos
  const isAdmin = () => user?.es_administrador === true;
  
  const isDocente = () => user?.rol === 'docente';
  
  const isPosgrado = () => user?.tipo_programa === 'posgrado';
  
  const canAccessSala = (tipoSala) => {
    if (isAdmin()) return true;
    if (tipoSala === 'libre') return true;
    if (tipoSala === 'posgrado') return isPosgrado() || isDocente();
    if (tipoSala === 'docente') return isDocente();
    return false;
  };

  const hasLimits = (tipoSala) => {
    // Docentes y posgrado no tienen límites en sus salas exclusivas
    if (isDocente() && tipoSala === 'docente') return false;
    if (isPosgrado() && tipoSala === 'posgrado') return false;
    // Para salas libres, todos tienen límites excepto admin
    if (tipoSala === 'libre' && !isAdmin()) return true;
    return false;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    isDocente,
    isPosgrado,
    canAccessSala,
    hasLimits,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
