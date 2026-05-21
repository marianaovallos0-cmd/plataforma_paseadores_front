import Loader from '@/components/Loader';
import { RatingStars } from '@/components/RatingStars';
import { useEffect, useState } from 'react';
import { FaBars, FaChevronRight, FaSearch, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../components/MenuLateral';
import ModalCalificarGenerico from '../components/ModalCalificarGenerico';
import { useAuth } from '../context/AuthContext';
import { useWalksByOwner } from '@/hooks/useWalksByOwner';
import calificacionApi from '@/core/infrastructure/api/calificacion.api';
import { mostrarAlerta } from '../utils/alerts';
import '../styles/pages/MiHistorial.css';

function MiHistorial() {
  const { user: usuario, loading: authLoading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('todo');
  const [busqueda, setBusqueda] = useState('');
  const [modalCalif, setModalCalif] = useState({ isOpen: false, walkId: null, paseadorId: null });
  const navigate = useNavigate();

  const { walks, loading: walksLoading, refetchWalks } = useWalksByOwner(usuario?.idUsuario);

  // Filtrar solo los finalizados
  const paseosFinalizados = walks.filter(w => w.estado === 'FINALIZADO');

  // Filtros adicionales (fecha y búsqueda)
  const filtrarPorFecha = (paseo) => {
    const fecha = new Date(paseo.fechaInicio);
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const inicioSemana = new Date(hoy); inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    switch (filtroFecha) {
      case 'hoy': return fecha >= hoy;
      case 'semana': return fecha >= inicioSemana;
      case 'mes': return fecha >= inicioMes;
      default: return true;
    }
  };

  const filtrarPorBusqueda = (paseo) => !busqueda || paseo.observaciones?.toLowerCase().includes(busqueda.toLowerCase());

  const paseosFiltrados = paseosFinalizados.filter(p => filtrarPorFecha(p) && filtrarPorBusqueda(p));

  const handleCalificar = (walkId, paseadorId) => {
    setModalCalif({ isOpen: true, walkId, paseadorId });
  };

  const guardarCalificacion = async (puntaje, comentario) => {
    try {
      await calificacionApi.calificarPaseo(usuario.idUsuario, modalCalif.walkId, { puntaje, comentario });
      mostrarAlerta('Calificación guardada', 'Gracias por calificar el paseo', 'success');
      setModalCalif({ isOpen: false, walkId: null, paseadorId: null });
      await refetchWalks(); // Refresca la lista para que calificado sea true
    } catch (error) {
      let mensaje = 'No se pudo guardar la calificación';
      if (error?.response?.data?.error?.message) {
        mensaje = error.response.data.error.message;
      } else if (error?.message) {
        mensaje = error.message;
      }
      mostrarAlerta('Error', mensaje, 'error');
      setModalCalif({ isOpen: false, walkId: null, paseadorId: null });
    }
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  if (authLoading || walksLoading) return <Loader/>;
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
              <input type="text" placeholder="Buscar por observaciones..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
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
                <div key={paseo.idPaseo} className="historial-card">
                  <div className="card-foto"><div className="foto-perro">🐕</div></div>
                  <div className="card-info">
                    <h3>Paseo #{paseo.idPaseo}</h3>
                    <p className="paseador">Paseador ID: {paseo.idPaseador}</p>
                    <div className="estrellas">
                      {paseo.calificado ? (
                        <span className="ya-calificado">✅ Ya calificado</span>
                      ) : (
                        <button className="btn-calificar" onClick={() => handleCalificar(paseo.idPaseo, paseo.idPaseador)}>
                          Calificar
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="card-fecha">
                    <span>{new Date(paseo.fechaInicio).toLocaleDateString('es-ES')}</span>
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
        onClose={() => setModalCalif({ isOpen: false, walkId: null, paseadorId: null })}
        titulo="Calificar paseo"
        nombreCalificado={`Paseador #${modalCalif.paseadorId}`}
        onCalificar={guardarCalificacion}
      />
    </div>
  );
}

export default MiHistorial;