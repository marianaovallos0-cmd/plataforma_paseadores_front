import { createContext, useContext, useState, useEffect } from 'react';
import { getSesionActual, clearSesion, setSesionActual } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sesion = getSesionActual();
    if (sesion) {
      setUser(sesion);
      setRol(sesion.rol);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setRol(userData.rol);
    setSesionActual(userData);
  };

  const logout = () => {
    clearSesion();
    setUser(null);
    setRol(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, rol, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);