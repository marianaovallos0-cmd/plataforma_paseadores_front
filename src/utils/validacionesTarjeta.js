// src/utils/validacionesTarjeta.js

// Algoritmo de Luhn para validar número de tarjeta
export const validarNumeroTarjeta = (numero) => {
  const digitos = numero.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digitos)) return false;
  if (/^(\d)\1+$/.test(digitos)) return false;
  if (digitos === '1234567812345678') return false;
  if (digitos === '1111111111111111') return false;

  let suma = 0;
  let alternar = false;
  for (let i = digitos.length - 1; i >= 0; i--) {
    let digito = parseInt(digitos.charAt(i), 10);
    if (alternar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
    alternar = !alternar;
  }
  return suma % 10 === 0;
};

// Validar fecha de expiración en formato MM/AA (ej: 04/26)
export const validarFechaExpiracion = (fecha) => {
  if (!/^\d{2}\/\d{2}$/.test(fecha)) return false;
  const [mes, anioStr] = fecha.split('/');
  const mesNum = parseInt(mes, 10);
  if (mesNum < 1 || mesNum > 12) return false;

  const anio = parseInt(anioStr, 10);
  const hoy = new Date();
  const anioActual = hoy.getFullYear() % 100; // ejemplo: 2026 -> 26
  const mesActual = hoy.getMonth() + 1;

  if (anio < anioActual) return false;
  if (anio === anioActual && mesNum < mesActual) return false;
  return true;
};