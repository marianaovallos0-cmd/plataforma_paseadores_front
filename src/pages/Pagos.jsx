import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import MenuLateral from '../components/MenuLateral';
import { useAuth } from '../context/AuthContext';
import { mostrarAlerta } from '../utils/alerts';
import '../styles/pages/Pagos.css';

function Pagos() {
  const { user: usuario, loading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  if (loading) return <div>Cargando...</div>;
  if (!usuario) return null;

  return (
    <div className="pagos-container">
      <div className="pagos-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="header-right">
          <div className="user-info">
            <span>{usuario.primerNombre} {usuario.primerApellido}</span>
            {usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="foto" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
          </div>
        </div>
      </div>
      <div className="pagos-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="pagos-content">
          <h2 className="pagos-title">Pagos y Facturación</h2>
          <div className="proximamente-card">
            <div className="proximamente-icon">💳</div>
            <h3>Próximamente</h3>
            <p>La sección de pagos estará disponible muy pronto.<br />Podrás ver tu historial de transacciones y gestionar tus métodos de pago.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagos;