import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaPaw, FaSpinner, FaCheckCircle, FaTimesCircle, FaTrash, FaCheck, FaBell } from 'react-icons/fa';
import MenuLateral from '../components/MenuLateral';
import { useAuth } from '../context/AuthContext';
import { getSolicitudes, updateSolicitud } from '../services/api';
import { ESTADOS_SOLICITUD } from '../constants';
import { mostrarAlerta, confirmarAccion } from '../utils/alerts';
import petApi from '@/core/infrastructure/api/pet.api';
import '../styles/pages/Dashboard.css';

function Dashboard() {
  const { user: usuario, loading: authLoading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [perroSeleccionado, setPerroSeleccionado] = useState(null);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [cargandoMascotas, setCargandoMascotas] = useState(false);
  const [errorMascotas, setErrorMascotas] = useState(null);
  const navigate = useNavigate();

  const cargarSolicitudes = () => {
    if (!usuario) return;
    const todas = getSolicitudes();
    const misSolicitudes = todas
      .filter(s => s.idDueño === usuario.idUsuario)
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
    setActividadReciente(misSolicitudes);
  };

  useEffect(() => {
    if (!authLoading && usuario) {
      const cargarMascotas = async () => {
        setCargandoMascotas(true);
        setErrorMascotas(null);
        try {
          console.log('Cargando mascotas para ownerId:', usuario.idUsuario);
          const pets = await petApi.getPetsByOwner(usuario.idUsuario);
          console.log('Mascotas recibidas:', pets);
          setMascotas(pets);
          if (pets && pets.length) setPerroSeleccionado(pets[0]);
        } catch (error) {
          console.error('Error cargando mascotas:', error);
          setErrorMascotas('No se pudieron cargar tus mascotas. Intenta recargar la página.');
        } finally {
          setCargandoMascotas(false);
        }
      };
      cargarMascotas();
      cargarSolicitudes();
    }
  }, [usuario, authLoading]);

  const handleSolicitarPaseo = () => {
    if (!perroSeleccionado && mascotas.length === 0) {
      mostrarAlerta('Atención', 'No tienes mascotas registradas', 'warning');
      return;
    }
    if (!perroSeleccionado) {
      mostrarAlerta('Atención', 'Selecciona una mascota primero', 'warning');
      return;
    }
    navigate('/solicitar-paseo');
  };

  const handleCancelar = async (id) => {
    const solicitud = actividadReciente.find(s => s.id === id);
    if (solicitud?.estado !== ESTADOS_SOLICITUD.PENDIENTE) return;
    const confirmed = await confirmarAccion('Cancelar solicitud', '¿Estás seguro de que quieres cancelar esta solicitud?');
    if (confirmed) {
      updateSolicitud(id, { estado: ESTADOS_SOLICITUD.CANCELADA });
      cargarSolicitudes();
      mostrarAlerta('Cancelada', 'La solicitud ha sido cancelada', 'success');
    }
  };

  const handleAceptar = async (id) => {
    const solicitud = actividadReciente.find(s => s.id === id);
    if (solicitud?.estado !== ESTADOS_SOLICITUD.PENDIENTE) return;
    updateSolicitud(id, { estado: ESTADOS_SOLICITUD.ACEPTADA });
    cargarSolicitudes();
    mostrarAlerta('Aceptada', 'Solicitud aceptada (simulación)', 'success');
  };

  const handleFinalizar = async (id) => {
    const solicitud = actividadReciente.find(s => s.id === id);
    if (solicitud?.estado !== ESTADOS_SOLICITUD.ACEPTADA) return;
    const confirmed = await confirmarAccion('Finalizar paseo', '¿Estás seguro de que el paseo ha terminado?');
    if (confirmed) {
      updateSolicitud(id, { estado: ESTADOS_SOLICITUD.FINALIZADA });
      cargarSolicitudes();
      mostrarAlerta('Éxito', 'Paseo finalizado. Puedes calificarlo en "Mi historial"', 'success');
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case ESTADOS_SOLICITUD.PENDIENTE: return { texto: 'Buscando paseador...', clase: 'badge-pendiente', icono: <FaSpinner className="icono-girando" /> };
      case ESTADOS_SOLICITUD.ACEPTADA: return { texto: 'Paseo aceptado', clase: 'badge-aceptada', icono: <FaCheckCircle /> };
      case ESTADOS_SOLICITUD.RECHAZADA: return { texto: 'Rechazada', clase: 'badge-rechazada', icono: <FaTimesCircle /> };
      case ESTADOS_SOLICITUD.FINALIZADA: return { texto: 'Finalizada', clase: 'badge-finalizada', icono: <FaCheckCircle /> };
      case ESTADOS_SOLICITUD.CANCELADA: return { texto: 'Cancelada', clase: 'badge-rechazada', icono: <FaTimesCircle /> };
      default: return { texto: estado, clase: '', icono: null };
    }
  };

  if (authLoading || cargandoMascotas) return <div>Cargando...</div>;
  if (!usuario) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}><FaBars /></button>
        <div className="header-right">
          <button className="btn-notificaciones" onClick={() => mostrarAlerta('Próximamente', 'Notificaciones estarán disponibles pronto', 'info')}>
            <FaBell />
          </button>
          <div className="user-info">
            <span>{usuario.primerNombre} {usuario.primerApellido}</span>
            {usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="foto" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
          </div>
        </div>
      </div>
      <div className="dashboard-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="dashboard-content">
          <div className="content-grid">
            <div className="col-left">
              <div className="section-welcome">
                <h2>Hola, {usuario.primerNombre} 👋</h2>
                <p>
                  ¿Listo(a) para pasear a{' '}
                  <strong>{perroSeleccionado ? perroSeleccionado.nombre : 'tu perro'}</strong>?
                </p>
                <button className="btn-solicitar" onClick={handleSolicitarPaseo}><FaPaw color="white" /> Solicitar Paseo</button>
              </div>
              <div className="section-perros">
                <h3>Mis mascotas</h3>
                {errorMascotas && <p className="error-message">{errorMascotas}</p>}
                <div className="perros-grid">
                  {mascotas.length > 0 ? (
                    mascotas.map(perro => (
                      <div
                        key={perro.idPerro}
                        className={`perro-card ${perroSeleccionado?.idPerro === perro.idPerro ? 'selected' : ''}`}
                        onClick={() => setPerroSeleccionado(perro)}
                      >
                        <div className="perro-foto">🐕</div>
                        <div className="perro-info">
                          <div className="perro-nombre">{perro.nombre}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No tienes perros registrados.</p>
                  )}
                </div>
              </div>
              <div className="section-mapa">
                <div className="mapa-placeholder-moderno">
                  <div className="mapa-icono">🗺️</div>
                  <h4>Mapa del recorrido</h4>
                  <p>En la versión final podrás ver en tiempo real la ubicación del paseador.</p>
                  <div className="puntos-animados"><span></span><span></span><span></span></div>
                </div>
              </div>
            </div>
            <div className="col-right">
              <div className="actividad-card">
                <h3>Actividad reciente</h3>
                {actividadReciente.length === 0 ? <p className="actividad-vacia">No hay actividad reciente</p> :
                  <div className="actividad-lista">
                    {actividadReciente.map(solicitud => {
                      const estadoInfo = getEstadoBadge(solicitud.estado);
                      return (
                        <div key={solicitud.id} className="actividad-item">
                          <div className="actividad-info">
                            <div className="actividad-mascota">{solicitud.nombreMascota || solicitud.mascotas?.map(m => m.nombre).join(', ')}</div>
                            <div className="actividad-fecha">{new Date(solicitud.fecha).toLocaleDateString('es-ES')} - {solicitud.hora}</div>
                            <div className="actividad-acciones">
                              <span className={`estado-badge ${estadoInfo.clase}`}>{estadoInfo.icono} {estadoInfo.texto}</span>
                              {solicitud.estado === ESTADOS_SOLICITUD.PENDIENTE && (
                                <>
                                  <button className="btn-aceptar" onClick={() => handleAceptar(solicitud.id)}><FaCheck /> Aceptar (prueba)</button>
                                  <button className="btn-cancelar" onClick={() => handleCancelar(solicitud.id)}><FaTrash /> Cancelar</button>
                                </>
                              )}
                              {solicitud.estado === ESTADOS_SOLICITUD.ACEPTADA && (
                                <button className="btn-finalizar" onClick={() => handleFinalizar(solicitud.id)}><FaCheck /> Finalizar paseo</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;