import { useState } from 'react';
import InputEdad from '../InputEdad';
import { validarNombreMascota, validarRaza, validarEdadMascota, validarObservaciones, getErrorMessage } from '../../utils/validaciones';
import '../../styles/configuracion/ModalEditarMascota.css';

function ModalEditarMascota({ isOpen, onClose, mascota, onGuardar }) {
  const [nombre, setNombre] = useState(mascota.nombre);
  const [raza, setRaza] = useState(mascota.raza);
  const [tamanio, setTamanio] = useState(mascota.tamanio);
  const [edad, setEdad] = useState(mascota.edad);
  const [observaciones, setObservaciones] = useState(mascota.observaciones || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validarNombreMascota(nombre)) {
      setError(getErrorMessage('nombreMascota'));
      return;
    }
    if (!validarRaza(raza)) {
      setError(getErrorMessage('raza'));
      return;
    }
    if (!tamanio) {
      setError('Selecciona un tamaño');
      return;
    }
    const partes = edad.split(' ');
    if (partes.length !== 2) {
      setError(getErrorMessage('edadMascota'));
      return;
    }
    const [num, unidad] = partes;
    if (!validarEdadMascota(num, unidad)) {
      setError(getErrorMessage('edadMascota'));
      return;
    }
    if (!validarObservaciones(observaciones)) {
      setError(getErrorMessage('observaciones'));
      return;
    }

    const mascotaActualizada = {
      ...mascota,
      nombre: nombre.trim(),
      raza: raza.trim(),
      tamanio,
      edad: edad.trim(),
      observaciones: observaciones.trim(),
    };
    onGuardar(mascotaActualizada);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Editar Mascota</h3>
        <form onSubmit={handleSubmit}>
          <label>Nombre *</label>
          <input type="text" maxLength="50" value={nombre} onChange={e => setNombre(e.target.value)} />

          <label>Raza *</label>
          <input type="text" maxLength="50" value={raza} onChange={e => setRaza(e.target.value)} />

          <label>Tamaño *</label>
          <select value={tamanio} onChange={e => setTamanio(e.target.value)}>
            <option value="">Selecciona</option>
            <option>Pequeño</option>
            <option>Mediano</option>
            <option>Grande</option>
          </select>

          <label>Edad *</label>
          <InputEdad value={edad} onChange={(e) => setEdad(e.target.value)} error={error && error.includes('edad') ? error : ''} />

          <label>Observaciones médicas (opcional)</label>
          <textarea
            rows="2"
            maxLength="500"
            placeholder="Ej: Es alérgico, tiene una herida, etc."
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}

          <div className="modal-buttons">
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-enviar">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarMascota;