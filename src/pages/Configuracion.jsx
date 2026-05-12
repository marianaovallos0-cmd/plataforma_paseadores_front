import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaPaw, FaCreditCard, FaBell, FaLock, FaUserSlash, FaEllipsisV, FaChevronRight, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import MenuLateral from '../components/MenuLateral';
import ModalAgregarMascota from '../components/Configuracion/ModalAgregarMascota';
import ModalListaMascotas from '../components/Configuracion/ModalListaMascotas';
import ModalDetalleMascota from '../components/Configuracion/ModalDetalleMascota';
import ModalAgregarTarjeta from '../components/Configuracion/ModalAgregarTarjeta';
import ModalListaTarjetas from '../components/Configuracion/ModalListaTarjetas';
import ModalEditarPerfil from '../components/Configuracion/ModalEditarPerfil';
import { useAuth } from '../context/AuthContext';
import { updateUsuario, getNotificaciones, setNotificaciones } from '../services/api';
import { mostrarAlerta, confirmarAccion } from '../utils/alerts';
import '../styles/pages/Configuracion.css';

function Configuracion() {
  const { user: usuario, loading, login } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [notificaciones, setNotificacionesState] = useState(false);
  const [modalAgregarMascota, setModalAgregarMascota] = useState(false);
  const [modalListaMascotas, setModalListaMascotas] = useState(false);
  const [modalDetalleMascota, setModalDetalleMascota] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [modalAgregarTarjeta, setModalAgregarTarjeta] = useState(false);
  const [modalListaTarjetas, setModalListaTarjetas] = useState(false);
  const [modalEditarPerfil, setModalEditarPerfil] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !usuario) {
      navigate('/');
      return;
    }
    if (usuario) {
      setNotificacionesState(getNotificaciones());
      if (!usuario.metodosPago) {
        const updated = { ...usuario, metodosPago: [] };
        updateUsuario(usuario.id, updated);
        login(updated);
      }
    }
  }, [usuario, loading, navigate, login]);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleGuardarPerfil = (usuarioActualizado) => {
    updateUsuario(usuarioActualizado.id, usuarioActualizado);
    login(usuarioActualizado);
    mostrarAlerta('Perfil actualizado', 'Los cambios se han guardado correctamente', 'success');
  };

  // MASCOTAS
  const agregarMascotaNueva = (nuevaMascota) => {
    const mascotas = usuario.mascotas || [];
    const updated = { ...usuario, mascotas: [...mascotas, nuevaMascota] };
    updateUsuario(updated.id, updated);
    login(updated);
  };
  const handleEliminarMascota = async (idMascota) => {
    const confirmed = await confirmarAccion('Eliminar mascota', '¿Estás seguro de que quieres eliminar esta mascota?');
    if (confirmed) {
      const nuevasMascotas = (usuario.mascotas || []).filter(m => m.id !== idMascota);
      const updated = { ...usuario, mascotas: nuevasMascotas };
      updateUsuario(updated.id, updated);
      login(updated);
      mostrarAlerta('Mascota eliminada', 'La mascota ha sido eliminada', 'success');
    }
  };
  const handleActualizarMascota = (mascotaActualizada) => {
    const nuevasMascotas = (usuario.mascotas || []).map(m => m.id === mascotaActualizada.id ? mascotaActualizada : m);
    const updated = { ...usuario, mascotas: nuevasMascotas };
    updateUsuario(updated.id, updated);
    login(updated);
    mostrarAlerta('Mascota actualizada', 'Los cambios se han guardado', 'success');
  };
  const handleVerDetalleMascota = (mascota) => {
    setMascotaSeleccionada(mascota);
    setModalDetalleMascota(true);
  };
  const handleOpcionesMascotas = () => setModalListaMascotas(true);
  const handleAgregarMascota = () => setModalAgregarMascota(true);

  // MÉTODOS DE PAGO
  const handleAgregarTarjeta = () => setModalAgregarTarjeta(true);
  const agregarTarjetaNueva = (nuevaTarjeta) => {
    const metodos = usuario.metodosPago || [];
    const updated = { ...usuario, metodosPago: [...metodos, nuevaTarjeta] };
    updateUsuario(updated.id, updated);
    login(updated);
    mostrarAlerta('Tarjeta agregada', 'Método de pago guardado', 'success');
  };
  const handleEliminarTarjeta = async (idTarjeta) => {
    const confirmed = await confirmarAccion('Eliminar tarjeta', '¿Eliminar este método de pago?');
    if (confirmed) {
      const nuevosMetodos = (usuario.metodosPago || []).filter(t => t.id !== idTarjeta);
      const updated = { ...usuario, metodosPago: nuevosMetodos };
      updateUsuario(updated.id, updated);
      login(updated);
      mostrarAlerta('Eliminada', 'Tarjeta eliminada', 'success');
    }
  };
  const handleActualizarTarjeta = (tarjetaActualizada) => {
    const nuevosMetodos = (usuario.metodosPago || []).map(t => t.id === tarjetaActualizada.id ? tarjetaActualizada : t);
    const updated = { ...usuario, metodosPago: nuevosMetodos };
    updateUsuario(updated.id, updated);
    login(updated);
    mostrarAlerta('Actualizada', 'Tarjeta actualizada', 'success');
  };
  const handleToggleTarjeta = (id) => {
    const nuevosMetodos = (usuario.metodosPago || []).map(t => t.id === id ? { ...t, activa: !t.activa } : t);
    const updated = { ...usuario, metodosPago: nuevosMetodos };
    updateUsuario(updated.id, updated);
    login(updated);
  };
  const handleOpcionesTarjetas = () => setModalListaTarjetas(true);

  // NOTIFICACIONES
  const handleToggleNotificaciones = () => {
    const nuevoEstado = !notificaciones;
    setNotificacionesState(nuevoEstado);
    setNotificaciones(nuevoEstado);
    mostrarAlerta('Notificaciones', nuevoEstado ? 'Activadas' : 'Desactivadas', 'info');
  };

  const handleCambiarContrasena = () => mostrarAlerta('Próximamente', 'Cambio de contraseña disponible pronto', 'info');
  const handleCerrarSesiones = () => mostrarAlerta('Próximamente', 'Cerrar sesiones activas disponible pronto', 'info');

  const handleOpciones = (seccion) => {
    if (seccion === 'Mascotas') handleOpcionesMascotas();
    else if (seccion === 'Métodos de pago') handleOpcionesTarjetas();
    else if (seccion === 'Seguridad') mostrarAlerta('Próximamente', 'Más opciones de seguridad', 'info');
  };

  if (loading) return <div>Cargando...</div>;
  if (!usuario) return null;

  return (
    <div className="config-container">
      <div className="config-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="user-info">
          <span>{usuario.nombreCompleto}</span>
          {usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="foto" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
        </div>
      </div>
      <div className="config-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="config-content">
          <div className="config-row-top">
            <div className="perfil-info">
              <div className="perfil-foto">{usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="perfil" className="perfil-foto-img" /> : '🐕'}</div>
              <div className="perfil-datos">
                <h3>{usuario.nombreCompleto}</h3>
                <p>{usuario.correo}</p>
                <p className="telefono">{usuario.telefono || 'Sin teléfono'}</p>
              </div>
            </div>
            <button className="btn-editar" onClick={() => setModalEditarPerfil(true)}>Editar</button>
          </div>
          <div className="config-row-middle">
            <div className="config-card">
              <div className="card-header"><h3>Mascotas</h3><FaEllipsisV className="opciones-icon" onClick={() => handleOpciones('Mascotas')} /></div>
              <div className="card-list">
                {usuario.mascotas?.length > 0 ? usuario.mascotas.map(m => (
                  <div key={m.id} className="list-item">
                    <div className="item-info"><FaPaw className="item-icon" /><span>{m.nombre}</span></div>
                    <FaChevronRight className="item-action" onClick={() => handleVerDetalleMascota(m)} />
                  </div>
                )) : <p>No hay mascotas registradas</p>}
              </div>
              <button className="btn-agregar" onClick={handleAgregarMascota}><FaPlus /> Agregar mascota</button>
            </div>
            <div className="config-card">
              <div className="card-header"><h3>Métodos de pago</h3><FaEllipsisV className="opciones-icon" onClick={() => handleOpciones('Métodos de pago')} /></div>
              <div className="card-list">
                {usuario.metodosPago?.length === 0 ? <p>No hay tarjetas registradas</p> :
                  usuario.metodosPago.map(t => (
                    <div key={t.id} className="list-item">
                      <div className="item-info"><FaCreditCard className="item-icon" /><span>{t.numero}</span></div>
                      <div className="item-toggle">
                        {t.activa ? <FaToggleOn className="toggle-on" onClick={() => handleToggleTarjeta(t.id)} /> : <FaToggleOff className="toggle-off" onClick={() => handleToggleTarjeta(t.id)} />}
                      </div>
                    </div>
                  ))}
              </div>
              <button className="btn-agregar" onClick={handleAgregarTarjeta}><FaPlus /> Agregar método</button>
            </div>
          </div>
          <div className="config-row-bottom">
            <div className="config-card">
              <div className="card-header"><h3>Notificaciones</h3></div>
              <div className="notificaciones-item">
                <div className="item-info"><FaBell className="item-icon" /><span>Habilitar notificaciones</span></div>
                <div className="item-toggle">
                  {notificaciones ? <FaToggleOn className="toggle-on" onClick={handleToggleNotificaciones} /> : <FaToggleOff className="toggle-off" onClick={handleToggleNotificaciones} />}
                </div>
              </div>
            </div>
            <div className="config-card">
              <div className="card-header"><h3>Seguridad</h3><FaEllipsisV className="opciones-icon" onClick={() => handleOpciones('Seguridad')} /></div>
              <div className="seguridad-item" onClick={handleCambiarContrasena}><FaLock className="item-icon" /><span>Cambiar Contraseña</span></div>
              <div className="seguridad-item" onClick={handleCerrarSesiones}><FaUserSlash className="item-icon" /><span>Cerrar sesiones activas</span></div>
            </div>
          </div>
        </div>
      </div>
      <ModalAgregarMascota isOpen={modalAgregarMascota} onClose={() => setModalAgregarMascota(false)} onAgregar={agregarMascotaNueva} />
      <ModalListaMascotas isOpen={modalListaMascotas} onClose={() => setModalListaMascotas(false)} mascotas={usuario.mascotas || []} onActualizar={handleActualizarMascota} onEliminar={handleEliminarMascota} />
      <ModalDetalleMascota isOpen={modalDetalleMascota} onClose={() => setModalDetalleMascota(false)} mascota={mascotaSeleccionada} />
      <ModalAgregarTarjeta isOpen={modalAgregarTarjeta} onClose={() => setModalAgregarTarjeta(false)} onAgregar={agregarTarjetaNueva} />
      <ModalListaTarjetas isOpen={modalListaTarjetas} onClose={() => setModalListaTarjetas(false)} tarjetas={usuario.metodosPago || []} onActualizar={handleActualizarTarjeta} onEliminar={handleEliminarTarjeta} />
      <ModalEditarPerfil isOpen={modalEditarPerfil} onClose={() => setModalEditarPerfil(false)} usuario={usuario} onGuardar={handleGuardarPerfil} />
    </div>
  );
}

export default Configuracion;