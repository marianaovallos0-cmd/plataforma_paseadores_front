import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePaseador, setSesionActual } from '../../services/api';
import '../../styles/pages/RegistroPaseador.css';

function RegistroPaseadorPaso3() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem('tempRegistroPaseador');
    if (!temp) {
      navigate('/registro-paseador/paso1');
      return;
    }
    setUserData(JSON.parse(temp));
  }, [navigate]);

  const handleFinalizar = () => {
    if (!userData) return;

    // Codificar contraseña antes de guardar
    const passwordEncoded = btoa(userData.password);
    const { password, ...resto } = userData;

    const nuevoPaseador = {
      id: Date.now(),
      ...resto,
      password: passwordEncoded,   // <-- guardamos la contraseña codificada
      fotoPerfil: '',
      calificacionPromedio: 0,
      fechaRegistro: new Date().toISOString(),
      rol: 'paseador',
      disponible: userData.disponible ?? true,
    };

    savePaseador(nuevoPaseador);
    // Para la sesión, quitamos la contraseña
    const { password: _, ...paseadorSinPassword } = nuevoPaseador;
    setSesionActual(paseadorSinPassword);

    localStorage.removeItem('tempRegistroPaseador');
    navigate('/');
  };

  if (!userData) return <div>Cargando...</div>;

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>CONFIRMAR REGISTRO</h2>
        <div className="profile-placeholder"><div className="profile-circle">✅</div></div>
        <div className="resumen">
          <h3>Datos personales</h3>
          <p><strong>Nombre:</strong> {userData.nombreCompleto}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>
          <p><strong>Teléfono:</strong> {userData.telefono}</p>
          <h3>Ubicación</h3>
          <p><strong>Ciudad:</strong> {userData.ciudad || 'Bogotá'}</p>
          <p><strong>Barrio:</strong> {userData.barrio}</p>
          <h3>Disponibilidad</h3>
          <p>Estado: <strong>{userData.disponible ? '🟢 Disponible' : '🔴 Ocupado'}</strong></p>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleFinalizar} className="btn-finish">Finalizar</button>
        <button className="btn-back" onClick={() => navigate('/registro-paseador/paso2')}>Atrás</button>
      </div>
    </div>
  );
}

export default RegistroPaseadorPaso3;