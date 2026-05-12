// src/services/usuarioService.js

const STORAGE_KEY = 'sesionActual';

export const obtenerUsuarioActual = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const guardarUsuarioActual = (usuario) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
};

export const actualizarPerfil = (nuevosDatos) => {
  const usuarioActual = obtenerUsuarioActual();
  if (usuarioActual) {
    const usuarioActualizado = { ...usuarioActual, ...nuevosDatos };
    guardarUsuarioActual(usuarioActualizado);
    return usuarioActualizado;
  }
  return null;
};