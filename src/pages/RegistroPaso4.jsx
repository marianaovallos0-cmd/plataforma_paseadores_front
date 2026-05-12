import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUsuario, setSesionActual } from '../services/api';
import '../styles/pages/RegistroPaso4.css';

function RegistroPaso4() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem('tempRegistro');
    if (!temp) {
      navigate('/registro/paso1');
      return;
    }
    setUserData(JSON.parse(temp));
  }, [navigate]);

  const handleFinalizar = () => {
    if (!userData) return;

    // 🔐 Codificar la contraseña antes de guardar
    const passwordEncoded = btoa(userData.password);
    const { password, ...resto } = userData;

    const nuevoUsuario = {
      id: Date.now(),
      ...resto,
      password: passwordEncoded,   // guardamos el Base64
      fotoPerfil: '',
      telefono: '',
      metodosPago: [],
    };

    saveUsuario(nuevoUsuario);
    // Sesión actual no incluye la contraseña (ni siquiera codificada)
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    setSesionActual({ ...usuarioSinPassword, rol: 'dueno' });

    localStorage.removeItem('tempRegistro');
    navigate('/');
  };

  if (!userData) return <div>Cargando...</div>;

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>CONFIRMAR</h2>
        <div className="profile-placeholder">
          <div className="profile-circle">✅</div>
        </div>

        <div className="resumen">
          <h3>Datos personales</h3>
          <p><strong>Nombre:</strong> {userData.nombreCompleto}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>

          <h3>Ubicación</h3>
          <p><strong>Dirección:</strong> {userData.direccion}</p>
          <p><strong>Ciudad:</strong> {userData.ciudad}</p>
          <p><strong>Barrio:</strong> {userData.barrio}</p>

          <h3>Mascotas</h3>
          {userData.mascotas.map(m => (
            <div key={m.id} className="resumen-mascota">
              <p><strong>{m.nombre}</strong> - {m.raza} ({m.tamanio}) - {m.edad}</p>
              {m.observaciones && <p>📝 {m.observaciones}</p>}
            </div>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button onClick={handleFinalizar} className="btn-finish">Finalizar</button>
        <button className="btn-back" onClick={() => navigate('/registro/mascotas')}>Atrás</button>
      </div>
    </div>
  );
}

export default RegistroPaso4;