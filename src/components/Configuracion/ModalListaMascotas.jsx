import { useState } from 'react';
import ModalEditarMascota from './ModalEditarMascota';
import { confirmarAccion, mostrarAlerta } from '../../utils/alerts';
import '../../styles/configuracion/ModalListaMascotas.css';

function ModalListaMascotas({ isOpen, onClose, mascotas, onActualizar, onEliminar }) {
  const [editandoMascota, setEditandoMascota] = useState(null);

  if (!isOpen) return null;

  const handleActualizar = (mascota) => {
    setEditandoMascota(mascota);
  };

  const handleEliminar = async (mascota) => {
    const confirmed = await confirmarAccion('Eliminar mascota', `¿Eliminar a ${mascota.nombre}?`);
    if (confirmed) {
      onEliminar(mascota.id);
    }
  };

  const handleGuardarEdicion = (mascotaEditada) => {
    onActualizar(mascotaEditada);
    setEditandoMascota(null);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>Gestionar Mascotas</h3>
          <div className="lista-mascotas-gestion">
            {mascotas.length === 0 ? (
              <p>No hay mascotas registradas</p>
            ) : (
              mascotas.map(m => (
                <div key={m.id} className="gestion-item">
                  <span>{m.nombre}</span>
                  <div className="gestion-botones">
                    <button className="btn-actualizar" onClick={() => handleActualizar(m)}>Actualizar</button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(m)}>Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="modal-buttons">
            <button className="btn-cancelar" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
      {editandoMascota && (
        <ModalEditarMascota
          isOpen={!!editandoMascota}
          onClose={() => setEditandoMascota(null)}
          mascota={editandoMascota}
          onGuardar={handleGuardarEdicion}
        />
      )}
    </>
  );
}

export default ModalListaMascotas;