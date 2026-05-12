import { useState } from 'react';
import InputEdad from '../InputEdad';
import { validarNombreMascota, validarRaza, validarEdadMascota, validarObservaciones, getErrorMessage } from '../../utils/validaciones';
import { mostrarAlerta } from '../../utils/alerts';
import '../../styles/configuracion/ModalAgregarMascota.css';

function ModalAgregarMascota({ isOpen, onClose, onAgregar }) {
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [tamanio, setTamanio] = useState('');
  const [edad, setEdad] = useState('');
  const [observaciones, setObservaciones] = useState('');
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
    const nuevaMascota = {
      id: Date.now(),
      nombre: nombre.trim(),
      raza: raza.trim(),
      tamanio,
      edad: edad.trim(),
      observaciones: observaciones.trim() || '',
    };
    onAgregar(nuevaMascota);
    setNombre('');
    setRaza('');
    setTamanio('');
    setEdad('');
    setObservaciones('');
    setError('');
    onClose();
    mostrarAlerta('Mascota agregada', `${nuevaMascota.nombre} ha sido agregada correctamente`, 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Agregar Mascota</h3>
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
            <button type="submit" className="btn-enviar">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ModalAgregarMascota;