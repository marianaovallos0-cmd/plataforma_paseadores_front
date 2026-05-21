import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarBarrio, getErrorMessage } from '../../utils/validaciones';
import { mostrarAlerta } from '../../utils/alerts';
import '../../styles/pages/RegistroPaseador.css';

function RegistroPaseadorPaso2() {
  const [ciudad] = useState('Bogotá');
  const [barrio, setBarrio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem('tempRegistroPaseador');
    if (!temp) navigate('/registro-paseador/paso1');
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarBarrio(barrio)) {
      setError(getErrorMessage('barrio'));
      return;
    }
    if (descripcion.length > 500) {
      setError('La descripción no puede superar los 500 caracteres');
      return;
    }
    const tempData = JSON.parse(localStorage.getItem('tempRegistroPaseador'));
    const userData = {
      ...tempData,
      ciudad,
      barrio: barrio.trim(),
      descripcion: descripcion.trim(),
      disponible,
    };
    localStorage.setItem('tempRegistroPaseador', JSON.stringify(userData));
    navigate('/registro-paseador/paso3');
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>UBICACIÓN Y PERFIL</h2>
        <div className="profile-placeholder"><div className="profile-circle">📍</div></div>
        <form onSubmit={handleSubmit}>
          <div className="campo-fijo">
            <label>Ciudad</label>
            <input type="text" value="Bogotá" disabled className="campo-disabled" />
          </div>
          <input type="text" maxLength="80" placeholder="Barrio *" value={barrio} onChange={e => setBarrio(e.target.value)} />
          <textarea
            rows="3"
            maxLength="500"
            placeholder="Descripción (experiencia, habilidades, etc.)"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
          <div className="disponibilidad-simple">
            <label>
              <input type="checkbox" checked={disponible} onChange={() => setDisponible(!disponible)} />
              Disponible para paseos
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-next">Siguiente</button>
        </form>
        <button className="btn-back" onClick={() => navigate('/registro-paseador/paso1')}>Atrás</button>
      </div>
    </div>
  );
}

export default RegistroPaseadorPaso2;