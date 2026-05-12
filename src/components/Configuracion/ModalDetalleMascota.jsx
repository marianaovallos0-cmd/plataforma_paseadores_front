import '../../styles/configuracion/ModalDetalleMascota.css';

function ModalDetalleMascota({ isOpen, onClose, mascota }) {
  if (!isOpen || !mascota) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Detalle de Mascota</h3>
        <div className="detalle-mascota">
          <div className="detalle-foto">🐕</div>
          <div className="detalle-info">
            <p><strong>Nombre:</strong> {mascota.nombre}</p>
            <p><strong>Raza:</strong> {mascota.raza}</p>
            <p><strong>Tamaño:</strong> {mascota.tamanio}</p>
            <p><strong>Edad:</strong> {mascota.edad}</p>
            <p><strong>Observaciones médicas:</strong> {mascota.observaciones || 'Ninguna'}</p>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalleMascota;