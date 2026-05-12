import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaDog, FaPaw, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import MenuLateral from '../components/MenuLateral';
import { useAuth } from '../context/AuthContext';
import { saveSolicitud } from '../services/api';
import { PRECIOS, ESTADOS_SOLICITUD } from '../constants';
import { mostrarAlerta } from '../utils/alerts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
registerLocale('es', es);
import '../styles/pages/SolicitarPaseo.css';

function SolicitarPaseo() {
  const { user: usuario, loading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [mascotasSeleccionadas, setMascotasSeleccionadas] = useState([]);
  const [tipoServicio, setTipoServicio] = useState('1h');
  const [fecha, setFecha] = useState(new Date());

  // Nuevo estado para la hora (con máscara HH:MM)
  const [hora, setHora] = useState('03:00');
  const [periodo, setPeriodo] = useState('PM');

  const [puntoEncuentro, setPuntoEncuentro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !usuario) {
      navigate('/');
    }
  }, [usuario, loading, navigate]);

  useEffect(() => {
    if (usuario && usuario.direccion) {
      setPuntoEncuentro(usuario.direccion);
    }
  }, [usuario]);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleMascotaChange = (id) => {
    if (mascotasSeleccionadas.includes(id))
      setMascotasSeleccionadas(mascotasSeleccionadas.filter(i => i !== id));
    else
      setMascotasSeleccionadas([...mascotasSeleccionadas, id]);
  };

  // Máscara de hora HH:MM
  const handleHoraChange = (value) => {
    let limpio = value.replace(/\D/g, '');
    limpio = limpio.slice(0, 4);

    let formateado = '';
    if (limpio.length >= 1) formateado = limpio.slice(0, 2);
    if (limpio.length >= 3) formateado += ':' + limpio.slice(2, 4);

    setHora(formateado);
  };

  // Convierte a formato 24h para guardar
  const convertirA24h = (horaStr, periodoStr) => {
    let [h, m] = horaStr.split(':');
    if (!h || !m) return null;
    h = parseInt(h, 10);
    if (periodoStr === 'PM' && h !== 12) h += 12;
    if (periodoStr === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
  };

  const cantidad = mascotasSeleccionadas.length;
  const total = (tipoServicio === '1h' ? PRECIOS.PASEO_1H : PRECIOS.PASEO_30MIN) * cantidad;
  const mascotasObjs = usuario?.mascotas?.filter(m => mascotasSeleccionadas.includes(m.id)) || [];

  const handleConfirmar = async () => {
    if (cantidad === 0) {
      mostrarAlerta('Atención', 'Selecciona al menos una mascota', 'warning');
      return;
    }
    if (!puntoEncuentro.trim()) {
      mostrarAlerta('Atención', 'El punto de encuentro es obligatorio', 'warning');
      return;
    }

    const hora24 = convertirA24h(hora, periodo);
    if (!hora24) {
      mostrarAlerta('Error', 'Hora inválida', 'warning');
      return;
    }

    const fechaISO = fecha.toISOString().split('T')[0];
    const nuevaSolicitud = {
      id: Date.now(),
      idDueño: usuario.id,
      mascotas: mascotasObjs,
      tipoServicio,
      fecha: fechaISO,
      hora: hora24,
      fechaHora: new Date(`${fechaISO}T${hora24}`).toISOString(),
      puntoEncuentro: puntoEncuentro.trim(),
      precioTotal: total,
      estado: ESTADOS_SOLICITUD.PENDIENTE,
      fechaCreacion: new Date().toISOString(),
      nombreMascota: mascotasObjs.map(m => m.nombre).join(', '),
    };
    saveSolicitud(nuevaSolicitud);
    mostrarAlerta('Éxito', 'Solicitud enviada con éxito', 'success');
    navigate('/dashboard');
  };

  if (loading) return <div>Cargando...</div>;
  if (!usuario) return null;

  return (
    <div className="solicitar-container">
      <div className="solicitar-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="header-right">
          <div className="user-info">
            <span>{usuario.nombreCompleto}</span>
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

            {/* 1. Selecciona la mascota */}
            <div className="form-section">
              <h3>1. Selecciona la mascota</h3>
              <div className="mascotas-grid">
                {usuario.mascotas?.map(m => (
                  <div key={m.id} className={`mascota-card ${mascotasSeleccionadas.includes(m.id) ? 'selected' : ''}`} onClick={() => handleMascotaChange(m.id)}>
                    <div className="mascota-check">
                      <input type="checkbox" checked={mascotasSeleccionadas.includes(m.id)} readOnly />
                    </div>
                    <div className="mascota-foto">🐕</div>
                    <div className="mascota-info">
                      <div className="mascota-nombre">{m.nombre}</div>
                      <div className="mascota-raza">{m.raza}</div>
                      <div className="mascota-edad">{m.edad}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-link" onClick={() => navigate('/configuracion')}>+ Agregar otra mascota</button>
            </div>

            {/* 2. Tipo de servicio */}
            <div className="form-section">
              <h3>2. Tipo de servicio</h3>
              <div className="servicios-grid">
                <div className={`servicio-card ${tipoServicio === '1h' ? 'selected' : ''}`} onClick={() => setTipoServicio('1h')}>
                  <div className="servicio-radio"><input type="radio" name="servicio" checked={tipoServicio === '1h'} readOnly /></div>
                  <div className="servicio-icono"><FaDog /></div>
                  <div className="servicio-info">
                    <div className="servicio-nombre">Paseo 1 hora</div>
                    <div className="servicio-descripcion">Recorrido estándar</div>
                  </div>
                  <div className="servicio-precio">${PRECIOS.PASEO_1H.toLocaleString()} COP</div>
                </div>
                <div className={`servicio-card ${tipoServicio === '30min' ? 'selected' : ''}`} onClick={() => setTipoServicio('30min')}>
                  <div className="servicio-radio"><input type="radio" name="servicio" checked={tipoServicio === '30min'} readOnly /></div>
                  <div className="servicio-icono"><FaDog /></div>
                  <div className="servicio-info">
                    <div className="servicio-nombre">Paseo 30 min</div>
                    <div className="servicio-descripcion">Para necesidades rápidas</div>
                  </div>
                  <div className="servicio-precio">${PRECIOS.PASEO_30MIN.toLocaleString()} COP</div>
                </div>
              </div>
            </div>

            {/* 3. Fecha y hora con el nuevo diseño */}
            <div className="form-section">
              <h3>3. Fecha y hora</h3>
              <div className="datetime-group">
                {/* Fecha */}
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
                {/* Hora con máscara y selector AM/PM */}
                <div className="input-group time-group">
                  <FaClock className="input-icon" />
                  <input
                    type="text"
                    value={hora}
                    onChange={(e) => handleHoraChange(e.target.value)}
                    placeholder="HH:MM"
                    maxLength={5}
                    className="time-input"
                  />
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="time-period"
                  >
                    <option value="AM">a.m.</option>
                    <option value="PM">p.m.</option>
                  </select>
                </div>
              </div>
              <div className="disponibilidad">Disponible hoy desde las 2:00 PM hasta las 8:00 PM</div>
            </div>

            {/* 4. Punto de encuentro */}
            <div className="form-section">
              <h3>4. Punto de encuentro</h3>
              <div className="input-group">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  value={puntoEncuentro}
                  readOnly
                  onClick={() => mostrarAlerta('Próximamente', 'Pronto podrás editar el punto de encuentro', 'info')}
                  className="readonly-input"
                  placeholder="Dirección del dueño"
                />
              </div>
              <p className="ayuda-texto">Se usará la dirección de tu perfil. Pronto podrás cambiarla.</p>
            </div>

            <button className="btn-confirmar" onClick={handleConfirmar}><FaPaw /> Confirmar solicitud – ${total.toLocaleString()} COP</button>
          </div>

          {/* Resumen */}
          <div className="solicitar-resumen">
            <h2>Resumen del paseo</h2>
            {cantidad > 0 ? (
              <>
                <div className="resumen-mascota"><div className="resumen-foto">🐕</div><div className="resumen-info"><div className="resumen-nombre">{mascotasObjs.map(m => m.nombre).join(', ')}</div><div className="resumen-raza">{mascotasObjs.length === 1 ? mascotasObjs[0].raza : `${cantidad} mascotas`}</div></div></div>
                <div className="resumen-item"><span>Servicio</span><span>{tipoServicio === '1h' ? 'Paseo 1 hora' : 'Paseo 30 min'}</span></div>
                <div className="resumen-item"><span>Fecha</span><span>{fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                <div className="resumen-item"><span>Hora</span><span>{hora}: {periodo}</span></div>
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