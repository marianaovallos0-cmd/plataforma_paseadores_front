export const validarNombre = (nombre) => /^[a-zA-ZáéíóúñÑ\s]{3,100}$/.test(nombre.trim());
export const validarEmail = (email) => /^[^\s@]{1,100}@[^\s@]{1,50}\.[^\s@]{2,10}$/.test(email.trim());
export const validarPassword = (password) => password.length >= 6 && password.length <= 50;

// Validación de teléfono colombiano (10 dígitos, no todos iguales, no secuencias simples)
export const validarTelefono = (telefono) => {
  const soloDigitos = telefono.replace(/\s/g, '');
  if (!/^\d{10}$/.test(soloDigitos)) return false;
  // Evitar números obvios
  if (/^(\d)\1{9}$/.test(soloDigitos)) return false; // todos iguales
  if (soloDigitos === '1234567890') return false;
  if (soloDigitos === '0987654321') return false;
  // Opcional: verificar que empiece con 3 (móvil) o 6,7,8 (fijo)
  const primerDigito = soloDigitos[0];
  if (!['3', '6', '7', '8'].includes(primerDigito)) return false;
  return true;
};

export const validarDireccion = (direccion) => /^[a-zA-Z0-9\s\#\-\.\,]{3,150}$/.test(direccion.trim());
export const validarCiudad = (ciudad) => /^[a-zA-ZáéíóúñÑ\s]{3,50}$/.test(ciudad.trim());
export const validarBarrio = (barrio) => /^[a-zA-ZáéíóúñÑ\s]{3,80}$/.test(barrio.trim());
export const validarNombreMascota = (nombre) => /^[a-zA-ZáéíóúñÑ\s]{2,50}$/.test(nombre.trim());
export const validarRaza = (raza) => /^[a-zA-ZáéíóúñÑ\s]{2,50}$/.test(raza.trim());
export const validarEdadMascota = (numero, unidad) => {
  const num = parseInt(numero, 10);
  if (isNaN(num) || num <= 0) return false;
  if (unidad === 'meses') return num <= 11;
  if (unidad === 'años') return num >= 1 && num <= 30;
  return false;
};
export const validarObservaciones = (texto) => texto.length <= 500;
export const validarPuntoEncuentro = (texto) => texto.length <= 150;
export const validarComentarioCalificacion = (texto) => texto.length <= 300;
export const validarTitularTarjeta = (titular) => /^[a-zA-ZáéíóúñÑ\s]{3,80}$/.test(titular.trim());

export const getErrorMessage = (tipo) => {
  const mensajes = {
    nombre: 'Nombre: solo letras, espacios, 3-100 caracteres',
    email: 'Correo inválido (máx 100 caracteres)',
    password: 'Contraseña de 6 a 50 caracteres',
    telefono: 'Teléfono: 10 dígitos, válido en Colombia (ej: 3101234567)',
    direccion: 'Dirección: 3-150 caracteres válidos',
    ciudad: 'Ciudad: solo letras, 3-50 caracteres',
    barrio: 'Barrio: solo letras, 3-80 caracteres',
    nombreMascota: 'Nombre mascota: solo letras, 2-50 caracteres',
    raza: 'Raza: solo letras, 2-50 caracteres',
    edadMascota: 'Edad: años (1-30) o meses (1-11)',
    observaciones: 'Observaciones: máximo 500 caracteres',
    puntoEncuentro: 'Punto de encuentro: máximo 150 caracteres',
    comentario: 'Comentario: máximo 300 caracteres',
    titularTarjeta: 'Nombre del titular: solo letras, 3-80 caracteres',
  };
  return mensajes[tipo] || 'Campo inválido';
};