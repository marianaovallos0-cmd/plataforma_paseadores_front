import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaStar, FaRegStar } from 'react-icons/fa';
import MenuLateral from '../../components/MenuLateral';
import { useAuth } from '../../context/AuthContext';
import { getSolicitudes, getCalificaciones, saveCalificacion } from '../../services/api';
import ModalCalificarGenerico from '../../components/ModalCalificarGenerico';
import { mostrarAlerta } from '../../utils/alerts';
import '../../styles/pages/HistorialPaseador.css';
import Loader from '@/components/Loader';

function HistorialPaseador() {
  const { user: paseador, loading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [historial, setHistorial] = useState([]);
  const [modalCalif, setModalCalif] = useState({ isOpen: false, solicitudId: null, duenoNombre: '' });
  const navigate = useNavigate();

  const cargarHistorial = () => {
    if (!paseador) return;
    const solicitudes = getSolicitudes();
    const calificaciones = getCalificaciones();
    const paseos = solicitudes
      .filter(s => s.estado === 'finalizada' && s.idPaseador === paseador.id)
      .map(s => {
        const miCalif = calificaciones.find(c => c.solicitudId === s.id && c.tipo === 'paseador');
        // Obtener nombre del dueño (deberías tenerlo en la solicitud, si no, usar "Dueño")
        const duenoNombre = 'Dueño'; // Podrías guardar el nombre del dueño en la solicitud al crearla
        return {
          id: s.id,
          fecha: new Date(s.fecha),
          fechaStr: new Date(s.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          mascota: s.nombreMascota,
          dueno: duenoNombre,
          calificacion: miCalif ? miCalif.puntaje : null,
          yaCalificado: !!miCalif,
          estado: s.estado,
        };
      })
      .sort((a, b) => b.fecha - a.fecha);
    setHistorial(paseos);
  };

  useEffect(() => {
    if (!loading && !paseador) {
      navigate('/');
      return;
    }
    if (paseador) {
      cargarHistorial();
    }
  }, [paseador, loading, navigate]);

  const handleCalificar = (solicitudId, duenoNombre) => {
    setModalCalif({ isOpen: true, solicitudId, duenoNombre });
  };

  const guardarCalificacion = (solicitudId, puntaje, comentario) => {
    const nuevaCalif = { id: Date.now(), solicitudId, tipo: 'paseador', puntaje, comentario, fecha: new Date().toISOString() };
    saveCalificacion(nuevaCalif);
    cargarHistorial();
    mostrarAlerta('Calificación guardada', 'Gracias por calificar al dueño', 'success');
  };

  const renderStars = (rating) => {
    if (rating === null) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) stars.push(i <= rating ? <FaStar key={i} className="star filled" /> : <FaRegStar key={i} className="star empty" />);
    return stars;
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  if (loading) return <Loader/>;
  if (!paseador) return null;

  return (
    <div className="historial-paseador-container">
      <div className="dashboard-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="user-info">
          <span>{paseador.nombreCompleto}</span>
          {paseador.fotoPerfil ? <img src={paseador.fotoPerfil} alt="perfil" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
        </div>
      </div>
      <div className="dashboard-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="historial-content">
          <h2>Historial de paseos</h2>
          {historial.length === 0 ? <div className="empty">No hay paseos finalizados aún</div> :
            <div className="cards-list">
              {historial.map(p => (
                <div key={p.id} className="historial-card">
                  <div className="card-info">
                    <h3>{p.mascota}</h3>
                    <p>Dueño: {p.dueno}</p>
                    <p>Fecha: {p.fechaStr}</p>
                    <div className="estrellas">
                      {p.calificacion ? renderStars(p.calificacion) : (!p.yaCalificado ?
                        <button className="btn-calificar" onClick={() => handleCalificar(p.id, p.dueno)}>Calificar al dueño</button> :
                        <span className="sin-calif">No calificado</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
      <ModalCalificarGenerico
        isOpen={modalCalif.isOpen}
        onClose={() => setModalCalif({ isOpen: false, solicitudId: null, duenoNombre: '' })}
        titulo="Calificar al dueño"
        nombreCalificado={modalCalif.duenoNombre}
        onCalificar={(puntaje, comentario) => guardarCalificacion(modalCalif.solicitudId, puntaje, comentario)}
      />
    </div>
  );
}

export default HistorialPaseador;