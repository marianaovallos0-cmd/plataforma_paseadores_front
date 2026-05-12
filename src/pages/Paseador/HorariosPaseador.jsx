import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaTrash, FaPlus } from 'react-icons/fa';
import MenuLateral from '../../components/MenuLateral';
import { useAuth } from '../../context/AuthContext';
import { updatePaseador, setSesionActual } from '../../services/api';
import { DIAS_SEMANA } from '../../constants';
import { mostrarAlerta, confirmarAccion } from '../../utils/alerts';
import '../../styles/pages/HorariosPaseador.css';

function HorariosPaseador() {
  const { user: paseador, loading, login } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('18:00');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !paseador) {
      navigate('/');
      return;
    }
    if (paseador) {
      setDisponibilidad(paseador.disponibilidad || []);
    }
  }, [paseador, loading, navigate]);

  const toggleDia = (dia) => {
    if (diasSeleccionados.includes(dia))
      setDiasSeleccionados(diasSeleccionados.filter(d => d !== dia));
    else
      setDiasSeleccionados([...diasSeleccionados, dia]);
  };

  const agregarHorario = async () => {
    if (diasSeleccionados.length === 0) {
      mostrarAlerta('Atención', 'Selecciona al menos un día', 'warning');
      return;
    }
    if (horaInicio >= horaFin) {
      mostrarAlerta('Error', 'La hora de inicio debe ser menor que la de fin', 'error');
      return;
    }
    const nuevos = diasSeleccionados.map(dia => ({ dia, horaInicio, horaFin }));
    const nuevaLista = [...disponibilidad, ...nuevos];
    const updated = { ...paseador, disponibilidad: nuevaLista };
    updatePaseador(paseador.id, updated);
    setSesionActual(updated);
    login(updated);
    setDisponibilidad(nuevaLista);
    setDiasSeleccionados([]);
    mostrarAlerta('Horario agregado', 'Disponibilidad guardada', 'success');
  };

  const eliminarHorario = async (idx) => {
    const confirmed = await confirmarAccion('Eliminar horario', '¿Deseas eliminar este horario?');
    if (confirmed) {
      const nuevaLista = [...disponibilidad];
      nuevaLista.splice(idx, 1);
      const updated = { ...paseador, disponibilidad: nuevaLista };
      updatePaseador(paseador.id, updated);
      setSesionActual(updated);
      login(updated);
      setDisponibilidad(nuevaLista);
      mostrarAlerta('Eliminado', 'Horario eliminado', 'success');
    }
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  if (loading) return <div>Cargando...</div>;
  if (!paseador) return null;

  return (
    <div className="horarios-container">
      <div className="dashboard-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="user-info">
          <span>{paseador.nombreCompleto}</span>
          {paseador.fotoPerfil ? <img src={paseador.fotoPerfil} alt="perfil" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
        </div>
      </div>
      <div className="dashboard-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="horarios-content">
          <h2>Gestión de disponibilidad</h2>
          <div className="horarios-form">
            <div className="dias-grid">
              {DIAS_SEMANA.map(dia => (
                <label key={dia} className="dia-label">
                  <input type="checkbox" checked={diasSeleccionados.includes(dia)} onChange={() => toggleDia(dia)} />
                  {dia}
                </label>
              ))}
            </div>
            <div className="horas-input">
              <label>Desde:</label>
              <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
              <label>Hasta:</label>
              <input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
              <button className="btn-agregar" onClick={agregarHorario}><FaPlus /> Agregar</button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="horarios-lista">
            <h3>Horarios actuales</h3>
            {disponibilidad.length === 0 ? <p>No hay horarios registrados</p> :
              disponibilidad.map((h, idx) => (
                <div key={idx} className="horario-item">
                  <span>{h.dia}: {h.horaInicio} - {h.horaFin}</span>
                  <button className="btn-eliminar" onClick={() => eliminarHorario(idx)}><FaTrash /></button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HorariosPaseador;