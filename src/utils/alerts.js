import Swal from 'sweetalert2';

export const mostrarAlerta = (titulo, mensaje, tipo = 'info') => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: tipo,
    confirmButtonText: 'OK',
    confirmButtonColor: '#5B3A8E',
    background: '#fff',
    customClass: {
      popup: 'swal-popup',
    },
  });
};

export const confirmarAccion = async (titulo, mensaje, confirmText = 'Sí', cancelText = 'Cancelar') => {
  const result = await Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#377046',
    cancelButtonColor: '#dc3545',
  });
  return result.isConfirmed;
};