// src/services/pagoService.js

const PAGOS_KEY = 'metodosPago';

export const obtenerMetodosPago = () => {
  const data = localStorage.getItem(PAGOS_KEY);
  if (data) return JSON.parse(data);
  // Datos de ejemplo
  return [
    { id: 1, numero: '**** 4582', numeroCompleto: '4588000000000000', titular: 'Mariana Ovallos', fechaExpiracion: '12/2028', cvv: '123', activa: true },
    { id: 2, numero: '**** 8443', numeroCompleto: '8443000000000000', titular: 'Mariana Ovallos', fechaExpiracion: '08/2027', cvv: '456', activa: false },
  ];
};

export const guardarMetodosPago = (metodos) => {
  localStorage.setItem(PAGOS_KEY, JSON.stringify(metodos));
};