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
import petApi from '@/core/infrastructure/api/pet.api';
import { mostrarAlerta, confirmarAccion } from '../utils/alerts';
import '../styles/pages/Configuracion.css';

function Configuracion() {
  const { user: authUser, loading: authLoading, login } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [notificaciones, setNotificacionesState] = useState(false);
  const [modalAgregarMascota, setModalAgregarMascota] = useState(false);
  const [modalListaMascotas, setModalListaMascotas] = useState(false);
  const [modalDetalleMascota, setModalDetalleMascota] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [modalAgregarTarjeta, setModalAgregarTarjeta] = useState(false);
  const [modalListaTarjetas, setModalListaTarjetas] = useState(false);
  const [modalEditarPerfil, setModalEditarPerfil] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      navigate('/');
      return;
    }
    setUsuario(authUser);
    // Cargar mascotas del dueño (sin userApi)
    const cargarMascotas = async () => {
      try {
        const mascotas = await petApi.getPetsByOwner(authUser.idUsuario);
        setUsuario(prev => ({ ...prev, mascotas }));
      } catch (error) {
        console.error('Error cargando mascotas:', error);
      }
    };
    cargarMascotas();
  }, [authUser, authLoading, navigate]);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleGuardarPerfil = (usuarioActualizado) => {
    setUsuario(usuarioActualizado);
    login(usuarioActualizado); // actualizar contexto
    mostrarAlerta('Perfil actualizado', 'Los cambios se han guardado', 'success');
  };

  // ========== MASCOTAS ==========
  const agregarMascotaNueva = async (nuevaMascota) => {
    try {
      const created = await petApi.createPet(usuario.idUsuario, {
        nombre: nuevaMascota.nombre,
        raza: nuevaMascota.raza,
        edad: parseInt(nuevaMascota.edad.split(' ')[0]) || 1,
        peso: nuevaMascota.peso,
        observaciones: nuevaMascota.observaciones || '',
        foto: '',
      });
      setUsuario(prev => ({ ...prev, mascotas: [...(prev.mascotas || []), created] }));
      mostrarAlerta('Mascota agregada', `${created.nombre} agregada`, 'success');
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo agregar la mascota', 'error');
    }
  };

  const handleEliminarMascota = async (idMascota) => {
    const confirmed = await confirmarAccion('Eliminar mascota', '¿Estás seguro?');
    if (confirmed) {
      // Si tienes endpoint de eliminación, descomenta:
      // await petApi.deletePet(idMascota);
      const nuevasMascotas = usuario.mascotas.filter(m => m.idPerro !== idMascota);
      setUsuario(prev => ({ ...prev, mascotas: nuevasMascotas }));
      mostrarAlerta('Mascota eliminada', 'Se ha eliminado correctamente', 'success');
    }
  };

  const handleActualizarMascota = async (mascotaActualizada) => {
    try {
      // await petApi.updatePet(mascotaActualizada.idPerro, mascotaActualizada);
      const nuevasMascotas = usuario.mascotas.map(m => m.idPerro === mascotaActualizada.idPerro ? mascotaActualizada : m);
      setUsuario(prev => ({ ...prev, mascotas: nuevasMascotas }));
      mostrarAlerta('Mascota actualizada', 'Cambios guardados', 'success');
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo actualizar', 'error');
    }
  };

  const handleVerDetalleMascota = (mascota) => {
    setMascotaSeleccionada(mascota);
    setModalDetalleMascota(true);
  };

  const handleOpcionesMascotas = () => setModalListaMascotas(true);
  const handleAgregarMascota = () => setModalAgregarMascota(true);

  // ========== MÉTODOS DE PAGO (placeholder) ==========
  const handleAgregarTarjeta = () => setModalAgregarTarjeta(true);
  const agregarTarjetaNueva = () => mostrarAlerta('Próximamente', 'Métodos de pago próximamente', 'info');
  const handleOpcionesTarjetas = () => setModalListaTarjetas(true);

  // ========== NOTIFICACIONES ==========
  const handleToggleNotificaciones = () => {
    const nuevoEstado = !notificaciones;
    setNotificacionesState(nuevoEstado);
    mostrarAlerta('Notificaciones', nuevoEstado ? 'Activadas' : 'Desactivadas', 'info');
  };

  // ========== SEGURIDAD ==========
  const handleCambiarContrasena = () => mostrarAlerta('Próximamente', 'Cambio de contraseña próximo', 'info');
  const handleCerrarSesiones = () => mostrarAlerta('Próximamente', 'Cerrar sesiones activas próximo', 'info');

  const handleOpciones = (seccion) => {
    if (seccion === 'Mascotas') handleOpcionesMascotas();
    else if (seccion === 'Métodos de pago') handleOpcionesTarjetas();
    else if (seccion === 'Seguridad') mostrarAlerta('Próximamente', 'Más opciones de seguridad', 'info');
  };

  if (authLoading) return <div>Cargando...</div>;
  if (!usuario) return null;

  return (
    <div className="config-container">
      <div className="config-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="header-right">
          <button className="btn-notificaciones" onClick={() => mostrarAlerta('Próximamente', 'Notificaciones próximamente', 'info')}>
            <FaBell />
          </button>
          <div className="user-info">
            <span>{usuario.primerNombre} {usuario.primerApellido}</span>
            {usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="foto" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
          </div>
        </div>
      </div>
      <div className="config-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="config-content">
          <div className="config-row-top">
            <div className="perfil-info">
              <div className="perfil-foto">{usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="perfil" className="perfil-foto-img" /> : '🐕'}</div>
              <div className="perfil-datos">
                <h3>{usuario.primerNombre} {usuario.primerApellido}</h3>
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
                {usuario.mascotas?.length > 0 ? (
                  usuario.mascotas.map(m => (
                    <div key={m.idPerro} className="list-item">
                      <div className="item-info"><FaPaw className="item-icon" /><span>{m.nombre}</span></div>
                      <FaChevronRight className="item-action" onClick={() => handleVerDetalleMascota(m)} />
                    </div>
                  ))
                ) : <p>No hay mascotas registradas</p>}
              </div>
              <button className="btn-agregar" onClick={handleAgregarMascota}><FaPlus /> Agregar mascota</button>
            </div>
            <div className="config-card">
              <div className="card-header"><h3>Métodos de pago</h3><FaEllipsisV className="opciones-icon" onClick={() => handleOpciones('Métodos de pago')} /></div>
              <div className="card-list"><p>Próximamente</p></div>
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
      <ModalListaTarjetas isOpen={modalListaTarjetas} onClose={() => setModalListaTarjetas(false)} tarjetas={metodosPago} onActualizar={() => {}} onEliminar={() => {}} />
      <ModalEditarPerfil isOpen={modalEditarPerfil} onClose={() => setModalEditarPerfil(false)} usuario={usuario} onGuardar={handleGuardarPerfil} />
    </div>
  );
}

export default Configuracion;