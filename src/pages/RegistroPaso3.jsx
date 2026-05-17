import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputEdad from '../components/InputEdad';
import { validarNombreMascota, validarRaza, validarEdadMascota, validarObservaciones, getErrorMessage } from '../utils/validaciones';
import { mostrarAlerta } from '../utils/alerts';
import '../styles/pages/RegistroPaso3.css';

function RegistroPaso3() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [peso, setPeso] = useState(''); // Cambio: tamaño -> peso
  const [edad, setEdad] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = localStorage.getItem('tempRegistro');
    if (!tempData) {
      navigate('/registro/paso1');
    }
  }, [navigate]);

  const agregarMascota = (e) => {
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
    if (!peso || isNaN(peso) || parseFloat(peso) <= 0) {
      setError('Ingresa un peso válido (número positivo)');
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
      peso: parseFloat(peso),
      edad: edad.trim(),
      observaciones: observaciones.trim() || '',
    };
    setMascotas([...mascotas, nuevaMascota]);
    setNombre('');
    setRaza('');
    setPeso('');
    setEdad('');
    setObservaciones('');
  };

  const eliminarMascota = (id) => {
    setMascotas(mascotas.filter(m => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mascotas.length === 0) {
      mostrarAlerta('Atención', 'Debes agregar al menos una mascota', 'warning');
      return;
    }
    const paso1y2 = JSON.parse(localStorage.getItem('tempRegistro'));
    if (!paso1y2) {
      navigate('/registro/paso1');
      return;
    }
    const userDataCompleto = { ...paso1y2, mascotas };
    localStorage.setItem('tempRegistro', JSON.stringify(userDataCompleto));
    navigate('/registro/confirmacion');
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>MASCOTAS</h2>
        <div className="profile-placeholder"><div className="profile-circle">🐕</div></div>
        <form onSubmit={agregarMascota} className="mascota-form">
          <input type="text" maxLength="50" placeholder="Nombre del perro (ej: Max)" value={nombre} onChange={e => setNombre(e.target.value)} />
          <input type="text" maxLength="50" placeholder="Raza (ej: Golden Retriever)" value={raza} onChange={e => setRaza(e.target.value)} />
          <input type="number" step="0.1" min="0.1" placeholder="Peso (kg)" value={peso} onChange={e => setPeso(e.target.value)} />
          <InputEdad value={edad} onChange={(e) => setEdad(e.target.value)} error={error && error.includes('edad') ? error : ''} />
          <input type="text" maxLength="500" placeholder="Observaciones médicas (opcional)" value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          <button type="submit" className="btn-add">+ Agregar Mascota</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {mascotas.length > 0 && (
          <div className="mascotas-lista">
            <h3>Tus mascotas:</h3>
            {mascotas.map(m => (
              <div key={m.id} className="mascota-item">
                <div>
                  <strong>{m.nombre}</strong> - {m.raza} ({m.peso} kg) - {m.edad}
                  {m.observaciones && <p className="obs">📝 {m.observaciones}</p>}
                </div>
                <button type="button" onClick={() => eliminarMascota(m.id)} className="btn-remove">Eliminar</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={handleSubmit} className="btn-next">Siguiente</button>
        <button className="btn-back" onClick={() => navigate('/registro/ubicacion')}>Atrás</button>
      </div>
    </div>
  );
}

export default RegistroPaso3;