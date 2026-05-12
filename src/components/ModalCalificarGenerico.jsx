import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { validarComentarioCalificacion, getErrorMessage } from '../utils/validaciones';
import '../styles/ModalCalificar.css';

function ModalCalificarGenerico({ isOpen, onClose, titulo, nombreCalificado, onCalificar }) {
  const [puntaje, setPuntaje] = useState(5);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');
  const [hover, setHover] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!validarComentarioCalificacion(comentario)) {
      setError(getErrorMessage('comentario'));
      return;
    }
    onCalificar(puntaje, comentario);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{titulo || 'Calificar'}</h3>
        <p>Calificando a: <strong>{nombreCalificado}</strong></p>
        <div className="estrellas-calificar">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setPuntaje(ratingValue)}
                  style={{ display: 'none' }}
                />
                <FaStar
                  className="star"
                  color={ratingValue <= (hover || puntaje) ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setPuntaje(ratingValue)}
                  style={{ cursor: 'pointer', fontSize: '2rem', marginRight: '0.2rem' }}
                />
              </label>
            );
          })}
        </div>
        <textarea
          maxLength="300"
          placeholder="Comentario (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows="3"
        />
        {error && <p className="error-message">{error}</p>}
        <div className="modal-buttons">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-enviar" onClick={handleSubmit}>Enviar calificación</button>
        </div>
      </div>
    </div>
  );
}

export default ModalCalificarGenerico;