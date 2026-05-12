import { FaHome, FaUser, FaCreditCard, FaCog, FaSignOutAlt, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import { confirmarAccion, mostrarAlerta } from '../utils/alerts';

function MenuLateral({ menuAbierto }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const rol = user?.rol;

  const handleLogout = async () => {
    const confirmed = await confirmarAccion(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      'Sí, cerrar',
      'Cancelar'
    );
    if (confirmed) {
      logout();
      mostrarAlerta('Sesión cerrada', 'Has cerrado sesión correctamente', 'success');
      navigate('/');
    }
  };

  const duenoOpciones = [
    { icono: <FaHome />, texto: 'Inicio', ruta: '/dashboard' },
    { icono: <FaUser />, texto: 'Mi historial', ruta: '/historial' },
    { icono: <FaCreditCard />, texto: 'Pagos', ruta: '/pagos' },
    { icono: <FaCog />, texto: 'Configuración', ruta: '/configuracion' },
  ];

  const paseadorOpciones = [
    { icono: <FaHome />, texto: 'Inicio', ruta: '/dashboard-paseador' },
    { icono: <FaCalendarAlt />, texto: 'Mis horarios', ruta: '/horarios-paseador' },
    { icono: <FaHistory />, texto: 'Historial', ruta: '/historial-paseador' },
    { icono: <FaCog />, texto: 'Configuración', ruta: '/configuracion-paseador' },
  ];

  const opciones = rol === ROLES.DUENO ? duenoOpciones : paseadorOpciones;

  return (
    <div className={`menu-lateral ${menuAbierto ? 'abierto' : 'cerrado'}`}>
      <div className="menu-logo"><h2>🐕 Delta</h2></div>
      <ul className="menu-opciones">
        {opciones.map((op, idx) => (
          <li key={idx} onClick={() => navigate(op.ruta)}>
            {op.icono} <span>{op.texto}</span>
          </li>
        ))}
      </ul>
      <div className="menu-logout" onClick={handleLogout}>
        <FaSignOutAlt /> <span>Cerrar Sesión</span>
      </div>
    </div>
  );
}

export default MenuLateral;