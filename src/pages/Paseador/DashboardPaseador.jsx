import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaCalendarCheck, FaClock, FaDog, FaMapMarkerAlt } from 'react-icons/fa';
import MenuLateral from '../../components/MenuLateral';
import { useAuth } from '../../context/AuthContext';
import { getSolicitudes, updateSolicitud } from '../../services/api';
import { ESTADOS_SOLICITUD } from '../../constants';
import { mostrarAlerta, confirmarAccion } from '../../utils/alerts';
import '../../styles/pages/DashboardPaseador.css';

function DashboardPaseador() {
  const { user: paseador, loading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [paseosActivos, setPaseosActivos] = useState([]);
  const navigate = useNavigate();

  const cargarSolicitudes = () => {
    if (!paseador) return;
    const todas = getSolicitudes();
    const pendientes = todas.filter(s => s.estado === ESTADOS_SOLICITUD.PENDIENTE);
    const activos = todas.filter(s => s.estado === ESTADOS_SOLICITUD.ACEPTADA && s.idPaseador === paseador.id);
    setSolicitudesPendientes(pendientes);
    setPaseosActivos(activos);
  };

  useEffect(() => {
    if (!loading && !paseador) {
      navigate('/');
      return;
    }
    if (paseador) {
      cargarSolicitudes();
    }
  }, [paseador, loading, navigate]);

  const aceptarSolicitud = async (id) => {
    const confirmed = await confirmarAccion('Aceptar solicitud', '¿Aceptar este paseo?');
    if (confirmed) {
      updateSolicitud(id, { estado: ESTADOS_SOLICITUD.ACEPTADA, idPaseador: paseador.id });
      cargarSolicitudes();
      mostrarAlerta('Aceptada', 'Solicitud aceptada', 'success');
    }
  };

  const rechazarSolicitud = async (id) => {
    const confirmed = await confirmarAccion('Rechazar solicitud', '¿Rechazar este paseo?');
    if (confirmed) {
      updateSolicitud(id, { estado: ESTADOS_SOLICITUD.RECHAZADA });
      cargarSolicitudes();
      mostrarAlerta('Rechazada', 'Solicitud rechazada', 'info');
    }
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  if (loading) return <div>Cargando...</div>;
  if (!paseador) return null;

  return (
    <div className="dashboard-paseador-container">
      <div className="dashboard-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="user-info">
          <span>{paseador.nombreCompleto}</span>
          {paseador.fotoPerfil ? <img src={paseador.fotoPerfil} alt="perfil" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
        </div>
      </div>
      <div className="dashboard-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="dashboard-content">
          <div className="seccion">
            <h2><FaDog /> Solicitudes pendientes</h2>
            {solicitudesPendientes.length === 0 ? <div className="empty-card">No hay solicitudes pendientes</div> :
              <div className="cards-grid">
                {solicitudesPendientes.map(s => (
                  <div key={s.id} className="solicitud-card">
                    <div className="card-header"><span className="mascota-nombre">{s.nombreMascota}</span><span className="precio">${s.precioTotal.toLocaleString()} COP</span></div>
                    <div className="card-info">
                      <p><FaCalendarCheck /> {new Date(s.fecha).toLocaleDateString('es-ES')}</p>
                      <p><FaClock /> {s.hora}</p>
                      <p><FaMapMarkerAlt /> Punto de encuentro: (simulado)</p>
                    </div>
                    <div className="card-actions">
                      <button className="btn-aceptar" onClick={() => aceptarSolicitud(s.id)}>Aceptar</button>
                      <button className="btn-rechazar" onClick={() => rechazarSolicitud(s.id)}>Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
          <div className="seccion">
            <h2><FaCalendarCheck /> Mis próximos paseos</h2>
            {paseosActivos.length === 0 ? <div className="empty-card">No tienes paseos activos</div> :
              <div className="cards-grid">
                {paseosActivos.map(s => (
                  <div key={s.id} className="solicitud-card activo">
                    <div className="card-header"><span className="mascota-nombre">{s.nombreMascota}</span><span className="precio">${s.precioTotal.toLocaleString()} COP</span></div>
                    <div className="card-info"><p><FaCalendarCheck /> {new Date(s.fecha).toLocaleDateString('es-ES')}</p><p><FaClock /> {s.hora}</p></div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPaseador;