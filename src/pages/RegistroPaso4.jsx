import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@/core/infrastructure/api/auth.api';
import direccionApi from '@/core/infrastructure/api/direccion.api';
import petApi from '@/core/infrastructure/api/pet.api';
import { ROLES } from '@/constants';
import { mostrarAlerta } from '../utils/alerts';
import '../styles/pages/RegistroPaso4.css';
import Loader from '@/components/Loader';

function RegistroPaso4() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem('tempRegistro');
    if (!temp) {
      navigate('/registro/paso1');
      return;
    }
    setUserData(JSON.parse(temp));
  }, [navigate]);

  const handleFinalizar = async () => {
    if (!userData) return;

    setLoading(true);
    setError('');

    try {
      // 1. Registrar usuario
      const payload = {
        correo: userData.correo,
        contrasena: userData.password,
        telefono: userData.telefono,
        primerNombre: userData.primerNombre,
        segundoNombre: userData.segundoNombre || '',
        primerApellido: userData.primerApellido,
        segundoApellido: userData.segundoApellido || '',
        fotoPerfil: '',
        roles: [ROLES.DUENO],
      };

      await authApi.register(payload);
      console.log('✅ Usuario registrado');

      // 2. Login automático
      const loginData = await authApi.login({
        email: userData.correo,
        password: userData.password,
      });
      localStorage.setItem('token', loginData.token);
      console.log('✅ Login automático ok');

      // 3. Crear dirección
      const direccionPayload = {
        detalle: userData.direccion || 'Dirección no especificada',
        barrio: userData.barrio || 'Barrio no especificado',
        ciudad: userData.ciudad || 'Bogotá',
        latitud: 0.0,
        longitud: 0.0,
      };
      await direccionApi.createDireccion(loginData.usuario.idUsuario, direccionPayload);
      console.log('✅ Dirección creada');

      // 4. Crear mascotas
      if (userData.mascotas && userData.mascotas.length > 0) {
        for (const mascota of userData.mascotas) {
          await petApi.createPet(loginData.usuario.idUsuario, {
            nombre: mascota.nombre,
            raza: mascota.raza,
            edad: parseInt(mascota.edad.split(' ')[0]) || 1,
            peso: mascota.peso,
            observaciones: mascota.observaciones || '',
            foto: '',
          });
        }
        console.log('✅ Mascotas creadas');
      }

      // 5. Guardar sesión y redirigir
      const sesion = { ...loginData.usuario, roles: loginData.usuario.roles, rol: ROLES.DUENO };
      localStorage.setItem('sesionActual', JSON.stringify(sesion));
      localStorage.removeItem('tempRegistro');

      mostrarAlerta('Registro exitoso', 'Cuenta creada. Redirigiendo al dashboard.', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error:', err);
      let errorMessage = 'Error al registrar usuario';
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

  if (!userData) return <Loader/>;

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>CONFIRMAR</h2>
        <div className="profile-placeholder">
          <div className="profile-circle">✅</div>
        </div>
        <div className="resumen">
          <h3>Datos personales</h3>
          <p><strong>Nombre:</strong> {userData.primerNombre} {userData.primerApellido}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>
          <p><strong>Teléfono:</strong> {userData.telefono}</p>
          <h3>Ubicación</h3>
          <p><strong>Dirección:</strong> {userData.direccion}</p>
          <p><strong>Ciudad:</strong> {userData.ciudad}</p>
          <p><strong>Barrio:</strong> {userData.barrio}</p>
          <h3>Mascotas</h3>
          {userData.mascotas?.length > 0 ? (
            userData.mascotas.map(m => (
              <div key={m.id} className="resumen-mascota">
                <p><strong>{m.nombre}</strong> - {m.raza} ({m.peso} kg) - {m.edad}</p>
                {m.observaciones && <p>📝 {m.observaciones}</p>}
              </div>
            ))
          ) : (
            <p>No se registraron mascotas (puedes agregarlas después).</p>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleFinalizar} className="btn-finish" disabled={loading}>
          {loading ? 'Registrando...' : 'Finalizar'}
        </button>
        <button className="btn-back" onClick={() => navigate('/registro/mascotas')}>Atrás</button>
      </div>
    </div>
  );
}

export default RegistroPaso4;