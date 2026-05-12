import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarBarrio, getErrorMessage } from '../../utils/validaciones';
import { mostrarAlerta } from '../../utils/alerts';
import '../../styles/pages/RegistroPaseador.css';

function RegistroPaseadorPaso2() {
  const [ciudad] = useState('Bogotá');
  const [barrio, setBarrio] = useState('');
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('18:00');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem('tempRegistroPaseador');
    if (!temp) navigate('/registro-paseador/paso1');
  }, [navigate]);

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleDiaChange = (dia) => {
    if (diasSeleccionados.includes(dia))
      setDiasSeleccionados(diasSeleccionados.filter(d => d !== dia));
    else
      setDiasSeleccionados([...diasSeleccionados, dia]);
  };

  const agregarDisponibilidad = () => {
    if (diasSeleccionados.length === 0) {
      mostrarAlerta('Atención', 'Selecciona al menos un día', 'warning');
      return;
    }
    if (horaInicio >= horaFin) {
      mostrarAlerta('Error', 'La hora de inicio debe ser menor que la de fin', 'error');
      return;
    }
    const nuevosHorarios = diasSeleccionados.map(dia => ({ dia, horaInicio, horaFin }));
    setDisponibilidad([...disponibilidad, ...nuevosHorarios]);
    setDiasSeleccionados([]);
  };

  const eliminarDisponibilidad = (index) => {
    const nueva = [...disponibilidad];
    nueva.splice(index, 1);
    setDisponibilidad(nueva);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarBarrio(barrio)) {
      setError(getErrorMessage('barrio'));
      return;
    }
    if (disponibilidad.length === 0) {
      mostrarAlerta('Atención', 'Debes agregar al menos un horario de disponibilidad', 'warning');
      return;
    }
    const tempData = JSON.parse(localStorage.getItem('tempRegistroPaseador'));
    const userData = {
      ...tempData,
      ciudad,
      barrio: barrio.trim(),
      disponibilidad,
    };
    localStorage.setItem('tempRegistroPaseador', JSON.stringify(userData));
    navigate('/registro-paseador/paso3');
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>UBICACIÓN Y DISPONIBILIDAD</h2>
        <div className="profile-placeholder"><div className="profile-circle">📍</div></div>
        <form onSubmit={handleSubmit}>
          <div className="campo-fijo">
            <label>Ciudad</label>
            <input type="text" value="Bogotá" disabled className="campo-disabled" />
          </div>
          <input type="text" maxLength="80" placeholder="Barrio (ej: Chapinero)" value={barrio} onChange={e => setBarrio(e.target.value)} />

          <div className="disponibilidad-seccion">
            <h4>Disponibilidad horaria</h4>
            <div className="dias-container">
              {diasSemana.map(dia => (
                <div key={dia} className="dia-checkbox">
                  <input type="checkbox" id={`dia-${dia}`} checked={diasSeleccionados.includes(dia)} onChange={() => handleDiaChange(dia)} />
                  <label htmlFor={`dia-${dia}`}>{dia}</label>
                </div>
              ))}
            </div>

            <div className="horario-inputs">
              <label>Desde:</label>
              <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
              <label>Hasta:</label>
              <input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
              <button type="button" className="btn-agregar" onClick={agregarDisponibilidad}>+ Agregar</button>
            </div>
            {error && <p className="error-message">{error}</p>}

            {disponibilidad.length > 0 && (
              <div className="lista-horarios">
                {disponibilidad.map((item, idx) => (
                  <div key={idx} className="horario-item">
                    <span>{item.dia}: {item.horaInicio} - {item.horaFin}</span>
                    <button type="button" className="btn-eliminar" onClick={() => eliminarDisponibilidad(idx)}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-next">Siguiente</button>
        </form>
        <button className="btn-back" onClick={() => navigate('/registro-paseador/paso1')}>Atrás</button>
      </div>
    </div>
  );
}

export default RegistroPaseadorPaso2;