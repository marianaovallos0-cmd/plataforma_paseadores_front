import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarBarrio, validarDireccion, getErrorMessage } from '../utils/validaciones';
import '../styles/pages/RegistroPaso2.css';

function RegistroPaso2() {
  const [tipoVia, setTipoVia] = useState('Calle');
  const [numVia, setNumVia] = useState('');
  const [letraVia, setLetraVia] = useState('');
  const [numPrimero, setNumPrimero] = useState('');
  const [numSegundo, setNumSegundo] = useState('');
  const [ciudad] = useState('Bogotá');
  const [barrio, setBarrio] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem('tempRegistro');
    if (!temp) navigate('/registro/paso1');
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!numVia || isNaN(numVia) || parseInt(numVia) <= 0) {
      setError('El número de la vía debe ser un número positivo');
      return;
    }
    if (!numPrimero || isNaN(numPrimero) || parseInt(numPrimero) <= 0) {
      setError('El número del # debe ser un número positivo');
      return;
    }
    if (!numSegundo || isNaN(numSegundo) || parseInt(numSegundo) <= 0) {
      setError('El número después del - debe ser un número positivo');
      return;
    }
    if (letraVia && !/^[A-Za-z]$/.test(letraVia)) {
      setError('La letra (opcional) debe ser un solo carácter alfabético');
      return;
    }

    let direccion = `${tipoVia} ${numVia}`;
    if (letraVia) direccion += ` ${letraVia.toUpperCase()}`;
    direccion += ` # ${numPrimero}-${numSegundo}`;

    if (!validarDireccion(direccion)) {
      setError(getErrorMessage('direccion'));
      return;
    }

    if (!validarBarrio(barrio)) {
      setError(getErrorMessage('barrio'));
      return;
    }

    const paso1Data = JSON.parse(localStorage.getItem('tempRegistro'));
    if (!paso1Data) {
      navigate('/registro/paso1');
      return;
    }

    const userData = {
      ...paso1Data,
      direccion,
      ciudad,
      barrio: barrio.trim(),
    };
    localStorage.setItem('tempRegistro', JSON.stringify(userData));
    navigate('/registro/mascotas');
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>UBICACIÓN</h2>
        <div className="profile-placeholder"><div className="profile-circle">📍</div></div>
        <form onSubmit={handleSubmit}>
          <div className="campo-fijo">
            <label>Ciudad</label>
            <input type="text" value="Bogotá" disabled className="campo-disabled" />
          </div>
          <div className="direccion-grupo">
            <div className="via-grupo">
              <select value={tipoVia} onChange={e => setTipoVia(e.target.value)}>
                <option>Calle</option><option>Carrera</option><option>Avenida</option><option>Diagonal</option><option>Transversal</option>
              </select>
              <input type="number" placeholder="Número vía" max="999" value={numVia} onChange={e => setNumVia(e.target.value)} />
            </div>
            <div className="letra-grupo">
              <input type="text" placeholder="Letra (opcional)" maxLength="1" value={letraVia} onChange={e => setLetraVia(e.target.value)} />
              <span>#</span>
              <input type="number" placeholder="Número 1" max="9999" value={numPrimero} onChange={e => setNumPrimero(e.target.value)} />
              <span>-</span>
              <input type="number" placeholder="Número 2" max="9999" value={numSegundo} onChange={e => setNumSegundo(e.target.value)} />
            </div>
          </div>
          <input type="text" placeholder="Barrio (ej: Chapinero)" maxLength="80" value={barrio} onChange={e => setBarrio(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-next">Siguiente</button>
        </form>
        <button className="btn-back" onClick={() => navigate('/registro/paso1')}>Atrás</button>
      </div>
    </div>
  );
}

export default RegistroPaso2;