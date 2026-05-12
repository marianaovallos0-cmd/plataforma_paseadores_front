import { useState } from 'react';
import ModalEditarTarjeta from './ModalEditarTarjeta';
import { confirmarAccion, mostrarAlerta } from '../../utils/alerts';
import '../../styles/configuracion/ModalListaTarjetas.css';

function ModalListaTarjetas({ isOpen, onClose, tarjetas, onActualizar, onEliminar }) {
  const [editandoTarjeta, setEditandoTarjeta] = useState(null);

  if (!isOpen) return null;

  const handleActualizar = (tarjeta) => {
    setEditandoTarjeta(tarjeta);
  };

  const handleEliminar = async (tarjeta) => {
    const confirmed = await confirmarAccion('Eliminar tarjeta', `¿Eliminar la tarjeta ${tarjeta.numero}?`);
    if (confirmed) {
      onEliminar(tarjeta.id);
    }
  };

  const handleGuardarEdicion = (tarjetaEditada) => {
    onActualizar(tarjetaEditada);
    setEditandoTarjeta(null);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>Gestionar Tarjetas</h3>
          <div className="lista-tarjetas-gestion">
            {tarjetas.length === 0 ? <p>No hay tarjetas registradas</p> :
              tarjetas.map(t => (
                <div key={t.id} className="gestion-item">
                  <span>{t.numero} - {t.titular}</span>
                  <div className="gestion-botones">
                    <button className="btn-actualizar" onClick={() => handleActualizar(t)}>Actualizar</button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(t)}>Eliminar</button>
                  </div>
                </div>
              ))}
          </div>
          <div className="modal-buttons">
            <button className="btn-cancelar" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
      {editandoTarjeta && (
        <ModalEditarTarjeta
          isOpen={!!editandoTarjeta}
          onClose={() => setEditandoTarjeta(null)}
          tarjeta={editandoTarjeta}
          onGuardar={handleGuardarEdicion}
        />
      )}
    </>
  );
}

export default ModalListaTarjetas;