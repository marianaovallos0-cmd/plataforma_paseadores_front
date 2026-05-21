import Loader from '@/components/Loader';
import { RatingStars } from '@/components/RatingStars';
import direccionApi from '@/core/infrastructure/api/direccion.api';
import petApi from '@/core/infrastructure/api/pet.api';
import solicitudApi from "@/core/infrastructure/api/solicitud.api";
import { useWalkers } from '@/hooks/useWalkers';
import es from 'date-fns/locale/es';
import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BiInfoCircle } from 'react-icons/bi';
import { FaBars, FaCalendarAlt, FaClock, FaDog, FaMapMarkerAlt, FaPaw, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../components/MenuLateral';
import { PRECIOS } from '../constants';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/SolicitarPaseo.css';
import { mostrarAlerta } from '../utils/alerts';
registerLocale('es', es);

function SolicitarPaseo() {
  const { user: usuario, loading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [mascotas, setMascotas] = useState([]);
  const [mascotasSeleccionadas, setMascotasSeleccionadas] = useState([]);
  const [selectedWalker, setSelectedWalker] = useState(undefined)
  const [tipoServicio, setTipoServicio] = useState('1h');
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState('15:00');
  const [puntoEncuentro, setPuntoEncuentro] = useState('');
  const [observacion, setObservacion] = useState('');
  const [cargandoMascotas, setCargandoMascotas] = useState(false);
  const { walkers, loadWalkers, refreshWalkers } = useWalkers();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !usuario) {
      navigate('/');
    }
  }, [usuario, loading, navigate]);

  // Cargar mascotas y dirección del dueño
  useEffect(() => {
    if (!usuario) return;

    const cargarDatos = async () => {
      try {
        // Cargar mascotas
        setCargandoMascotas(true);
        const pets = await petApi.getPetsByOwner(usuario.idUsuario);
        setMascotas(pets);
        
        // Cargar dirección principal
        const direcciones = await direccionApi.findByUserId(usuario.idUsuario);
        if (direcciones && direcciones.length > 0) {
          const dir = direcciones[0];
          setPuntoEncuentro(`${dir.detalle}, ${dir.barrio}, ${dir.ciudad}`);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setCargandoMascotas(false);
      }
    };
    cargarDatos();
  }, [usuario]);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const handleMascotaChange = (id) => {
    if (mascotasSeleccionadas.includes(id))
      setMascotasSeleccionadas(mascotasSeleccionadas.filter(i => i !== id));
    else
      setMascotasSeleccionadas([...mascotasSeleccionadas, id]);
  };

  const cantidad = mascotasSeleccionadas.length;
  const total = (tipoServicio === '1h' ? PRECIOS.PASEO_1H : PRECIOS.PASEO_30MIN) * cantidad;
  const mascotasObjs = mascotas.filter(m => mascotasSeleccionadas.includes(m.idPerro));

  const handleConfirmar = async () => {
    if (cantidad === 0) {
      mostrarAlerta('Atención', 'Selecciona al menos una mascota', 'warning');
      return;
    }
    if (!puntoEncuentro.trim()) {
      mostrarAlerta('Atención', 'El punto de encuentro es obligatorio', 'warning');
      return;
    }

    try {
      await solicitudApi.createSolicitud(usuario.idUsuario, {
        horaSugerida: hora,
        idPaseador: selectedWalker,
        observaciones: observacion,
        perros: mascotasSeleccionadas,
        puntoEncuentro: puntoEncuentro.trim()
      })
      mostrarAlerta('Éxito', 'Solicitud enviada con éxito', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      
    }
  };

  if (loading || cargandoMascotas) return <Loader/>;
  if (!usuario) return null;

  return (
    <div className="solicitar-container">
      <div className="solicitar-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="header-right">
          <div className="user-info">
            <span>{usuario.primerNombre} {usuario.primerApellido}</span>
            {usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="foto" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
          </div>
        </div>
      </div>
      <div className="solicitar-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="solicitar-content">
          <div className="solicitar-form">
            <div className="form-header"><FaPaw className="form-icon" /><h1>Solicitar Paseo</h1></div>
            <p className="form-subtitle">Completa los datos para solicitar un paseo</p>

            {/* 1. Mascotas */}
            <div className="form-section">
              <h3>1. Selecciona la mascota</h3>
              <div className="mascotas-grid">
                {mascotas.length > 0 ? (
                  mascotas.map(m => (
                    <div key={m.idPerro} className={`mascota-card ${mascotasSeleccionadas.includes(m.idPerro) ? 'selected' : ''}`} onClick={() => handleMascotaChange(m.idPerro)}>
                      <div className="mascota-check"><input type="checkbox" checked={mascotasSeleccionadas.includes(m.idPerro)} readOnly /></div>
                      <div className="mascota-foto">🐕</div>
                      <div className="mascota-info">
                        <div className="mascota-nombre">{m.nombre}</div>
                        <div className="mascota-raza">{m.raza}</div>
                        <div className="mascota-edad">{m.edad} años</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No tienes mascotas registradas. Ve a Configuración para agregar.</p>
                )}
              </div>
              <button className="btn-link" onClick={() => navigate('/configuracion')}>+ Agregar otra mascota</button>
            </div>

            {loadWalkers && <Loader/>}
            {!loadWalkers && (
              <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>2. Selecciona al paseador que desees</h3>
                  <button 
                    className="btn-refresh-ranking" 
                    onClick={refreshWalkers} 
                    disabled={loadWalkers}
                    style={{ background: '#5B3A8E', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Actualizar ranking
                  </button>
                </div>
                <div className="mascotas-grid">
                  {walkers.length > 0 ? (
                    walkers.map(w => (
                      <div key={w.idUsuario} className={`mascota-card ${selectedWalker === w.idUsuario ? 'selected' : ''}`} onClick={() => setSelectedWalker(w.idUsuario)}>
                        <div className="mascota-check"><input type="checkbox" checked={selectedWalker === w.idUsuario} readOnly /></div>
                        <div className="mascota-info">
                          <div className="mascota-nombre">{w.primerNombre}</div>
                          <div className="mascota-raza"><RatingStars rating={w.reputacion}/></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay paseadores disponibles en este momento.</p>
                  )}
                </div>
                <button className="btn-link" onClick={() => navigate('/configuracion')}>+ Agregar otra mascota</button>
              </div>
            )}


            {/* 3. Tipo de servicio */}
            <div className="form-section">
              <h3>3. Tipo de servicio</h3>
              <div className="servicios-grid">
                <div className={`servicio-card ${tipoServicio === '1h' ? 'selected' : ''}`} onClick={() => setTipoServicio('1h')}>
                  <div className="servicio-radio"><input type="radio" name="servicio" checked={tipoServicio === '1h'} readOnly /></div>
                  <div className="servicio-icono"><FaDog /></div>
                  <div className="servicio-info"><div className="servicio-nombre">Paseo 1 hora</div><div className="servicio-descripcion">Recorrido estándar</div></div>
                  <div className="servicio-precio">${PRECIOS.PASEO_1H.toLocaleString()} COP</div>
                </div>
                <div className={`servicio-card ${tipoServicio === '30min' ? 'selected' : ''}`} onClick={() => setTipoServicio('30min')}>
                  <div className="servicio-radio"><input type="radio" name="servicio" checked={tipoServicio === '30min'} readOnly /></div>
                  <div className="servicio-icono"><FaDog /></div>
                  <div className="servicio-info"><div className="servicio-nombre">Paseo 30 min</div><div className="servicio-descripcion">Para necesidades rápidas</div></div>
                  <div className="servicio-precio">${PRECIOS.PASEO_30MIN.toLocaleString()} COP</div>
                </div>
              </div>
            </div>

            {/* 4. Fecha y hora */}
            <div className="form-section">
              <h3>4. Fecha y hora</h3>
              <div className="datetime-group">
                <div className="input-group">
                  <FaCalendarAlt className="input-icon" />
                  <DatePicker
                    selected={fecha}
                    onChange={setFecha}
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    minDate={new Date()}
                    className="datepicker-input"
                  />
                </div>
                <div className="input-group">
                  <FaClock className="input-icon" />
                  <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="time-input" />
                </div>
              </div>
              <div className="disponibilidad">Disponible hoy desde las 2:00 PM hasta las 8:00 PM</div>
            </div>

            {/* 5. Punto de encuentro */}
            <div className="form-section">
              <h3>5. Punto de encuentro</h3>
              <div className="input-group">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  value={puntoEncuentro}
                  onChange={(e) => setPuntoEncuentro(e.target.value)}
                  placeholder="Dirección del dueño"
                />
              </div>
              <p className="ayuda-texto">Puedes modificar el punto de encuentro si lo deseas.</p>
            </div>

            {/* 6. Punto de encuentro */}
            <div className="form-section">
              <h3>6. Observaciones</h3>
              <div className="input-group">
                <BiInfoCircle className="input-icon" />
                <textarea
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Cualquier cosilla..."
                />
              </div>
            </div>

            <button className="btn-confirmar" onClick={handleConfirmar}><FaPaw /> Confirmar solicitud</button>
          </div>

          {/* Resumen */}
          <div className="solicitar-resumen">
            <h2>Resumen del paseo</h2>
            {cantidad > 0 ? (
              <>
                <div className="resumen-mascota"><div className="resumen-foto">🐕</div><div className="resumen-info"><div className="resumen-nombre">{mascotasObjs.map(m => m.nombre).join(', ')}</div><div className="resumen-raza">{mascotasObjs.length === 1 ? mascotasObjs[0].raza : `${cantidad} mascotas`}</div></div></div>
                <div className="resumen-item"><span>Servicio</span><span>{tipoServicio === '1h' ? 'Paseo 1 hora' : 'Paseo 30 min'}</span></div>
                <div className="resumen-item"><span>Fecha</span><span>{fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                <div className="resumen-item"><span>Hora</span><span>{hora}</span></div>
                <div className="resumen-item"><span>Punto de encuentro</span><span>{puntoEncuentro}</span></div>
                <hr />
                <div className="resumen-item"><span>Subtotal</span><span>${total.toLocaleString()} COP</span></div>
                <div className="resumen-item"><span>Tarifa de la app</span><span>Gratis</span></div>
                <div className="resumen-total"><span>Total a pagar</span><span>${total.toLocaleString()} COP</span></div>
              </>
            ) : <p className="resumen-vacio">Selecciona una mascota para ver el resumen</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolicitarPaseo;