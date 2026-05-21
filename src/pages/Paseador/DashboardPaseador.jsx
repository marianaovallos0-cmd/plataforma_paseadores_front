import Loader from '@/components/Loader';
import { useRequestByWalker } from '@/hooks/useRequests';
import { useEffect, useState } from 'react';
import { FaBars, FaCalendarCheck, FaClock, FaDog, FaMapMarkerAlt, FaToggleOff, FaToggleOn, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../../components/MenuLateral';
import { useAuth } from '../../context/AuthContext';
import { setSesionActual, updatePaseador } from '../../services/api';
import '../../styles/pages/DashboardPaseador.css';
import { confirmarAccion, mostrarAlerta } from '../../utils/alerts';
import { useWalksByWalker } from '@/hooks/useWalks';

function DashboardPaseador() {
  const { user: paseador, loading, login } = useAuth();
  
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [disponible, setDisponible] = useState(paseador?.disponible ?? true);
  const {
    pendingRequests, 
    loadRequests, 
    acceptRequest, 
    rejectRequest
  } = useRequestByWalker(paseador.idUsuario)
  const {
    inRouteWalks, 
    finalizedWalks, 
    loadWalks, 
    endWalk,
    fetchWalksByWalker
  } = useWalksByWalker(paseador.idUsuario)

  const navigate = useNavigate();

  useEffect(() => {
    if (!paseador || !paseador.idUsuario) {
      navigate('/');
    }
  }, [paseador, navigate]);

  // Cambiar disponibilidad y guardar en localStorage
  const toggleDisponibilidad = async () => {
    const nuevoEstado = !disponible;
    const actionText = nuevoEstado ? 'disponible' : 'ocupado';
    const confirmed = await confirmarAccion(
      `Cambiar a ${actionText}`,
      `¿Estás seguro de que quieres marcarte como ${actionText}?`
    );
    if (confirmed) {
      setDisponible(nuevoEstado);
      // Actualizar en el objeto paseador (localStorage)
      const updatedPaseador = { ...paseador, disponible: nuevoEstado };
      updatePaseador(paseador.id, updatedPaseador);
      setSesionActual(updatedPaseador);
      login(updatedPaseador);
      mostrarAlerta('Estado actualizado', `Ahora estás ${actionText}`, 'success');
    }
  };

  const aceptarSolicitud = async (id) => {
    if (!disponible) {
      mostrarAlerta('No disponible', 'No puedes aceptar solicitudes si estás ocupado', 'warning');
      return;
    }
    const confirmed = await confirmarAccion('Aceptar solicitud', '¿Aceptar este paseo?');
    if (confirmed) {
      await acceptRequest(id);
      await fetchWalksByWalker();
      console.log('Después de fetchWalksByWalker');
      mostrarAlerta('Aceptada', 'Solicitud aceptada', 'success');
    }
  };

  const finalizarPaseo = async (id) => {
    const confirmed = await confirmarAccion('Finalizar Paseo', '¿Deseas finalizar el paseo?');
    if (confirmed) {
      await endWalk(id);
      mostrarAlerta('Aceptada', 'Paseo finalizado', 'success');
    }
  };

  const rechazarSolicitud = async (id) => {
    const confirmed = await confirmarAccion('Rechazar solicitud', '¿Rechazar este paseo?');
    if (confirmed) {
      await rejectRequest(id)
      mostrarAlerta('Rechazada', 'Solicitud rechazada', 'info');
    }
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  if (loading || loadRequests) return <Loader/>;
  if (!paseador) return null;

  const fullName = `${paseador.primerNombre} ${paseador.primerApellido}`
  

  return (
    <div className="dashboard-paseador-container">
      <div className="dashboard-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="header-right">
          <div className="user-info">
            <span>{fullName}</span>
            {paseador.fotoPerfil ? <img src={paseador.fotoPerfil} alt="perfil" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
          </div>
        </div>
      </div>
      <div className="dashboard-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="dashboard-content">
          <h1>Hola! {fullName} 👋</h1>
          {/* Estado de disponibilidad */}
          <div className="disponibilidad-card">
            <div className="disponibilidad-info">
              <span className="estado-label">Estado actual:</span>
              <span className={`estado-valor ${disponible ? 'disponible' : 'ocupado'}`}>
                {disponible ? '🟢 Disponible' : '🔴 Ocupado'}
              </span>
            </div>
            <button className="btn-toggle" onClick={toggleDisponibilidad}>
              {disponible ? <FaToggleOn className="toggle-on" /> : <FaToggleOff className="toggle-off" />}
              {disponible ? 'Marcarse como ocupado' : 'Marcarse como disponible'}
            </button>
          </div>

          <div className="seccion">
            <h2><FaDog /> Solicitudes pendientes</h2>
            {pendingRequests.length === 0 ? <div className="empty-card">No hay solicitudes pendientes</div> :
              <div className="cards-grid">
                {pendingRequests.map(s => (
                  <div key={s.idSolicitud} className="solicitud-card">
                    <div className="card-header"><span className="mascota-nombre">Cantidad de mascotas: {s.cantidadPerros}</span></div>
                    <div className="card-info">
                      <p><FaCalendarCheck /> {new Date(s.fechaSolicitud).toLocaleDateString('es-ES')}</p>
                      <p><FaClock /> {s.horaSugerida}</p>
                      <p><FaMapMarkerAlt /> {s.puntoEncuentro || 'Punto de encuentro no especificado'}</p>
                    </div>
                    <div className="card-actions">
                      <button className="btn-aceptar" onClick={() => aceptarSolicitud(s.idSolicitud)}>Aceptar</button>
                      <button className="btn-rechazar" onClick={() => rechazarSolicitud(s.idSolicitud)}>Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>

          <div className="seccion">
            {loadWalks && <Loader/>}
            {!loadWalks && (
              <>
                <h2><FaCalendarCheck /> Mis paseos</h2>
                {inRouteWalks.length === 0 ? <div className="empty-card">No tienes paseos activos</div> :
                  <div className="cards-grid">
                    {inRouteWalks.map(s => (
                      <div key={s.idPaseo} className="solicitud-card activo">
                        <div className="card-header"><span className="mascota-nombre">{s.observaciones}</span><span className="precio">$24.000 COP</span></div>
                        <div className="card-info"><p><FaCalendarCheck /> {new Date(s.fechaInicio).toLocaleDateString('es-ES')}</p><p><FaClock /> {s.fechaFin}</p></div>
                        <div className="card-actions">
                          <button className="btn-aceptar" onClick={() => finalizarPaseo(s.idPaseo)}>Finalizar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </>
            )}
          </div>

          <div className="seccion">
            {loadWalks && <Loader/>}
            {!loadWalks && (
              <>
                <h2><FaCalendarCheck /> Paseos finalizados</h2>
                {finalizedWalks.length === 0 ? <div className="empty-card">No tienes paseos activos</div> :
                  <div className="cards-grid">
                    {finalizedWalks.map(s => (
                      <div key={s.idPaseo} className="solicitud-card activo">
                        <div className="card-header"><span className="mascota-nombre">{s.observaciones}</span><span className="precio">$24.000 COP</span></div>
                        <div className="card-info"><p><FaCalendarCheck /> {new Date(s.fechaInicio).toLocaleDateString('es-ES')}</p><p><FaClock /> {s.fechaFin}</p></div>
                      </div>
                    ))}
                  </div>
                }
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPaseador;