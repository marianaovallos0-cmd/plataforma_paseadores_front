import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@/core/infrastructure/api/auth.api';
import { mostrarAlerta } from '../../utils/alerts';
import '../../styles/pages/RegistroPaseador.css';

function RegistroPaseadorPaso3() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem('tempRegistroPaseador');
    if (!temp) {
      navigate('/registro-paseador/paso1');
      return;
    }
    setUserData(JSON.parse(temp));
  }, [navigate]);

  const handleFinalizar = async () => {
    if (!userData) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        correo: userData.correo,
        contrasena: userData.password,
        telefono: userData.telefono,
        primerNombre: userData.primerNombre,
        segundoNombre: userData.segundoNombre || '',
        primerApellido: userData.primerApellido,
        segundoApellido: userData.segundoApellido || '',
        fotoPerfil: '',
        descripcion: userData.descripcion || '',
      };

      await authApi.registerWalker(payload);
      mostrarAlerta(
        'Registro exitoso',
        'Cuenta de paseador creada. Ahora inicia sesión.',
        'success'
      );
      localStorage.removeItem('tempRegistroPaseador');
      navigate('/');
    } catch (err) {
      console.error('Error al registrar paseador:', err);
      let errorMessage = 'Error al registrar paseador';
      if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      mostrarAlerta('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <div>Cargando...</div>;

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>CONFIRMAR REGISTRO</h2>
        <div className="profile-placeholder"><div className="profile-circle">✅</div></div>
        <div className="resumen">
          <h3>Datos personales</h3>
          <p><strong>Nombre:</strong> {userData.primerNombre} {userData.primerApellido}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>
          <p><strong>Teléfono:</strong> {userData.telefono}</p>
          <h3>Ubicación</h3>
          <p><strong>Ciudad:</strong> {userData.ciudad}</p>
          <p><strong>Barrio:</strong> {userData.barrio}</p>
          <h3>Descripción</h3>
          <p>{userData.descripcion || 'No especificada'}</p>
          <h3>Disponibilidad</h3>
          <p>{userData.disponible ? '🟢 Disponible' : '🔴 Ocupado'}</p>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleFinalizar} className="btn-finish" disabled={loading}>
          {loading ? 'Registrando...' : 'Finalizar'}
        </button>
        <button className="btn-back" onClick={() => navigate('/registro-paseador/paso2')}>Atrás</button>
      </div>
    </div>
  );
}

export default RegistroPaseadorPaso3;