import Loader from '@/components/Loader';
import RecentActivity from '@/components/RecentActivity';
import petApi from '@/core/infrastructure/api/pet.api';
import { useEffect, useState } from 'react';
import { FaBars, FaBell, FaPaw, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../components/MenuLateral';
import { useAuth } from '../context/AuthContext';
import { getSolicitudes } from '../services/api';
import '../styles/pages/Dashboard.css';
import { mostrarAlerta } from '../utils/alerts';

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

  if (authLoading || cargandoMascotas) return <Loader/>;
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
            <RecentActivity/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;