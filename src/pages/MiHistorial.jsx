import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaSearch, FaChevronRight, FaStar, FaRegStar } from 'react-icons/fa';
import MenuLateral from '../components/MenuLateral';
import ModalCalificarGenerico from '../components/ModalCalificarGenerico';
import { useAuth } from '../context/AuthContext';
import { getSolicitudes, getCalificaciones, saveCalificacion } from '../services/api';
import { ESTADOS_SOLICITUD } from '../constants';
import { mostrarAlerta } from '../utils/alerts';
import '../styles/pages/MiHistorial.css';

function MiHistorial() {
  const { user: usuario, loading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [historial, setHistorial] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('todo');
  const [busqueda, setBusqueda] = useState('');
  const [modalCalif, setModalCalif] = useState({ isOpen: false, solicitudId: null, paseadorNombre: '' });
  const navigate = useNavigate();

  const cargarHistorial = () => {
    if (!usuario) return;
    const solicitudes = getSolicitudes();
    const calificaciones = getCalificaciones();
    // Solo mostrar las solicitudes que están FINALIZADAS (o ACEPTADAS para pruebas)
    const paseos = solicitudes
      .filter(s => s.idDueño === usuario.idUsuario && s.estado === ESTADOS_SOLICITUD.FINALIZADA)
      .map(s => {
        const miCalif = calificaciones.find(c => c.solicitudId === s.id && c.tipo === 'dueño');
        return {
          id: s.id,
          fecha: new Date(s.fecha),
          fechaStr: new Date(s.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          mascota: s.nombreMascota || (s.mascotas ? s.mascotas.map(m => m.nombre).join(', ') : 'Mascota'),
          paseador: 'Paseador asignado', // en simulación no tenemos nombre real
          calificacion: miCalif ? miCalif.puntaje : null,
          yaCalificado: !!miCalif,
          estado: s.estado,
        };
      })
      .sort((a, b) => b.fecha - a.fecha);
    setHistorial(paseos);
  };

  useEffect(() => {
    if (!loading && usuario) {
      cargarHistorial();
    }
  }, [usuario, loading]);

  const filtrarPorFecha = (paseo) => {
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const inicioSemana = new Date(hoy); inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    switch (filtroFecha) {
      case 'hoy': return paseo.fecha >= hoy;
      case 'semana': return paseo.fecha >= inicioSemana;
      case 'mes': return paseo.fecha >= inicioMes;
      default: return true;
    }
  };

  const filtrarPorBusqueda = (paseo) => !busqueda || paseo.mascota.toLowerCase().includes(busqueda.toLowerCase());

  const paseosFiltrados = historial.filter(p => filtrarPorFecha(p) && filtrarPorBusqueda(p));

  const renderStars = (rating) => {
    if (rating === null) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <FaStar key={i} className="star filled" /> : <FaRegStar key={i} className="star empty" />);
    }
    return stars;
  };

  const handleCalificar = (solicitudId, paseadorNombre) => {
    setModalCalif({ isOpen: true, solicitudId, paseadorNombre });
  };

  const guardarCalificacion = (solicitudId, puntaje, comentario) => {
    const nuevaCalif = {
      id: Date.now(),
      solicitudId,
      tipo: 'dueño',
      puntaje,
      comentario,
      fecha: new Date().toISOString()
    };
    saveCalificacion(nuevaCalif);
    cargarHistorial(); // refrescar la lista
    mostrarAlerta('Calificación guardada', 'Gracias por calificar el paseo', 'success');
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  if (loading) return <div>Cargando...</div>;
  if (!usuario) return null;

  return (
    <div className="historial-container">
      <div className="historial-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="header-right">
          <div className="user-info">
            <span>{usuario.primerNombre} {usuario.primerApellido}</span>
            {usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="foto" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
          </div>
        </div>
      </div>
      <div className="historial-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="historial-content">
          <div className="historial-filtros">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Buscar por mascota..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            </div>
            <div className="filtros-fecha">
              <button className={filtroFecha === 'hoy' ? 'active' : ''} onClick={() => setFiltroFecha('hoy')}>Hoy</button>
              <button className={filtroFecha === 'semana' ? 'active' : ''} onClick={() => setFiltroFecha('semana')}>Esta semana</button>
              <button className={filtroFecha === 'mes' ? 'active' : ''} onClick={() => setFiltroFecha('mes')}>Este mes</button>
              <button className={filtroFecha === 'todo' ? 'active' : ''} onClick={() => setFiltroFecha('todo')}>Todo</button>
            </div>
          </div>
          <div className="historial-lista">
            {paseosFiltrados.length === 0 ? (
              <div className="sin-paseos">No hay paseos finalizados en este período</div>
            ) : (
              paseosFiltrados.map(paseo => (
                <div key={paseo.id} className="historial-card">
                  <div className="card-foto"><div className="foto-perro">🐕</div></div>
                  <div className="card-info">
                    <h3>{paseo.mascota}</h3>
                    <p className="paseador">{paseo.paseador}</p>
                    <div className="estrellas">
                      {paseo.calificacion ? renderStars(paseo.calificacion) : (!paseo.yaCalificado ?
                        <button className="btn-calificar" onClick={() => handleCalificar(paseo.id, paseo.paseador)}>Calificar</button> :
                        <span className="sin-calif">No calificado</span>)}
                    </div>
                  </div>
                  <div className="card-fecha">
                    <span>{paseo.fechaStr}</span>
                    <FaChevronRight className="detalle-icon" onClick={() => mostrarAlerta('Próximamente', 'Detalle del paseo disponible pronto', 'info')} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ModalCalificarGenerico
        isOpen={modalCalif.isOpen}
        onClose={() => setModalCalif({ isOpen: false, solicitudId: null, paseadorNombre: '' })}
        titulo="Calificar paseo"
        nombreCalificado={modalCalif.paseadorNombre}
        onCalificar={(puntaje, comentario) => guardarCalificacion(modalCalif.solicitudId, puntaje, comentario)}
      />
    </div>
  );
}

export default MiHistorial;