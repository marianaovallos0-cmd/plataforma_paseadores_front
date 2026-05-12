// src/services/api.js
const STORAGE_KEYS = {
  USUARIOS: 'usuarios',
  PASEADORES: 'paseadores',
  SOLICITUDES: 'solicitudes',
  CALIFICACIONES: 'calificaciones',
  NOTIFICACIONES: 'notificaciones',
  SESION_ACTUAL: 'sesionActual',
};

const getData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Usuarios (dueños)
export const getUsuarios = () => getData(STORAGE_KEYS.USUARIOS);
export const saveUsuario = (usuario) => {
  const usuarios = getUsuarios();
  usuarios.push(usuario);
  setData(STORAGE_KEYS.USUARIOS, usuarios);
  return usuario;
};
// En src/services/api.js
export const updateUsuario = (id, nuevosDatos) => {
  let usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    // Si viene una nueva contraseña, codificarla
    if (nuevosDatos.password) {
      nuevosDatos.password = btoa(nuevosDatos.password);
    }
    const usuarioActualizado = { ...usuarios[index], ...nuevosDatos };
    usuarios[index] = usuarioActualizado;
    setData(STORAGE_KEYS.USUARIOS, usuarios);
    const sesion = getSesionActual();
    if (sesion && sesion.id === id) {
      // Eliminar contraseña de la sesión
      const { password, ...usuarioSinPassword } = usuarioActualizado;
      setSesionActual(usuarioSinPassword);
    }
    return usuarioActualizado;
  }
  return null;
};
export const deleteUsuario = (id) => {
  let usuarios = getUsuarios();
  setData(STORAGE_KEYS.USUARIOS, usuarios.filter(u => u.id !== id));
};

// Paseadores (similar, pero no usamos sesión aquí)
export const getPaseadores = () => getData(STORAGE_KEYS.PASEADORES);
export const savePaseador = (paseador) => {
  const paseadores = getPaseadores();
  paseadores.push(paseador);
  setData(STORAGE_KEYS.PASEADORES, paseadores);
  return paseador;
};
export const updatePaseador = (id, nuevosDatos) => {
  let paseadores = getPaseadores();
  const index = paseadores.findIndex(p => p.id === id);
  if (index !== -1) {
    paseadores[index] = { ...paseadores[index], ...nuevosDatos };
    setData(STORAGE_KEYS.PASEADORES, paseadores);
    const sesion = localStorage.getItem(STORAGE_KEYS.SESION_ACTUAL);
    if (sesion) {
      const sesionActual = JSON.parse(sesion);
      if (sesionActual.id === id && sesionActual.rol === 'paseador') {
        localStorage.setItem(STORAGE_KEYS.SESION_ACTUAL, JSON.stringify(paseadores[index]));
      }
    }
    return paseadores[index];
  }
  return null;
};
export const deletePaseador = (id) => {
  let paseadores = getPaseadores();
  setData(STORAGE_KEYS.PASEADORES, paseadores.filter(p => p.id !== id));
};

// Solicitudes, calificaciones, notificaciones no cambian
export const getSolicitudes = () => getData(STORAGE_KEYS.SOLICITUDES);
export const saveSolicitud = (solicitud) => {
  const solicitudes = getSolicitudes();
  solicitudes.push(solicitud);
  setData(STORAGE_KEYS.SOLICITUDES, solicitudes);
  return solicitud;
};
export const updateSolicitud = (id, nuevosDatos) => {
  let solicitudes = getSolicitudes();
  const index = solicitudes.findIndex(s => s.id === id);
  if (index !== -1) {
    solicitudes[index] = { ...solicitudes[index], ...nuevosDatos };
    setData(STORAGE_KEYS.SOLICITUDES, solicitudes);
    return solicitudes[index];
  }
  return null;
};
export const deleteSolicitud = (id) => {
  let solicitudes = getSolicitudes();
  setData(STORAGE_KEYS.SOLICITUDES, solicitudes.filter(s => s.id !== id));
};

export const getCalificaciones = () => getData(STORAGE_KEYS.CALIFICACIONES);
export const saveCalificacion = (calificacion) => {
  const calificaciones = getCalificaciones();
  calificaciones.push(calificacion);
  setData(STORAGE_KEYS.CALIFICACIONES, calificaciones);
  return calificacion;
};
export const updateCalificacion = (id, nuevosDatos) => {
  let calificaciones = getCalificaciones();
  const index = calificaciones.findIndex(c => c.id === id);
  if (index !== -1) {
    calificaciones[index] = { ...calificaciones[index], ...nuevosDatos };
    setData(STORAGE_KEYS.CALIFICACIONES, calificaciones);
    return calificaciones[index];
  }
  return null;
};

export const getNotificaciones = () => localStorage.getItem(STORAGE_KEYS.NOTIFICACIONES) === 'true';
export const setNotificaciones = (estado) => localStorage.setItem(STORAGE_KEYS.NOTIFICACIONES, estado.toString());

export const getSesionActual = () => {
  const sesion = localStorage.getItem(STORAGE_KEYS.SESION_ACTUAL);
  return sesion ? JSON.parse(sesion) : null;
};
export const setSesionActual = (usuario) => localStorage.setItem(STORAGE_KEYS.SESION_ACTUAL, JSON.stringify(usuario));
export const clearSesion = () => localStorage.removeItem(STORAGE_KEYS.SESION_ACTUAL);

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
};