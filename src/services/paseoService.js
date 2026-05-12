// src/services/paseoService.js

const STORAGE_KEY = 'solicitudes';

// Obtener todas las solicitudes
export const obtenerSolicitudes = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Guardar solicitudes (privado)
const guardarSolicitudes = (solicitudes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudes));
};

// Crear nueva solicitud
export const crearSolicitud = (nuevaSolicitud) => {
  const solicitudes = obtenerSolicitudes();
  const nueva = {
    id: Date.now(),
    ...nuevaSolicitud,
    estado: 'pendiente', // pendiente, aceptada, rechazada, en_curso, finalizada
    createdAt: new Date().toISOString(),
  };
  solicitudes.push(nueva);
  guardarSolicitudes(solicitudes);
  return nueva;
};

// Obtener solicitudes de un dueño específico
export const obtenerSolicitudesPorDueno = (idDueño) => {
  const solicitudes = obtenerSolicitudes();
  return solicitudes.filter(s => s.idDueño === idDueño);
};