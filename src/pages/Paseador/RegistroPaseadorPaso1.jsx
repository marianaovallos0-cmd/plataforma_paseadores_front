import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarNombre, validarEmail, validarPassword, validarTelefono, getErrorMessage } from '../../utils/validaciones';
import { getPaseadores } from '../../services/api';
import { mostrarAlerta } from '../../utils/alerts';
import '../../styles/pages/RegistroPaseador.css';

function RegistroPaseadorPaso1() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validarNombre(nombreCompleto)) {
      setError(getErrorMessage('nombre'));
      return;
    }
    if (!validarEmail(correo)) {
      setError(getErrorMessage('email'));
      return;
    }
    const paseadores = getPaseadores();
    if (paseadores.some(p => p.correo === correo.trim())) {
      mostrarAlerta('Error', 'Este correo ya está registrado como paseador', 'error');
      return;
    }
    if (!validarPassword(password)) {
      setError(getErrorMessage('password'));
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!validarTelefono(telefono)) {
      setError(getErrorMessage('telefono'));
      return;
    }

    // Guardar temporalmente (se borrará al finalizar)
    const tempData = {
      nombreCompleto: nombreCompleto.trim(),
      correo: correo.trim(),
      password, // solo temporal, se borrará
      telefono: telefono.trim(),
    };
    localStorage.setItem('tempRegistroPaseador', JSON.stringify(tempData));
    navigate('/registro-paseador/paso2');
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>REGISTRO PASEADOR</h2>
        <div className="profile-placeholder"><div className="profile-circle">🐕‍🦺</div></div>
        <form onSubmit={handleSubmit}>
          <input type="text" maxLength="100" placeholder="Nombre Completo" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} />
          <input type="email" maxLength="100" placeholder="Correo electrónico" value={correo} onChange={e => setCorreo(e.target.value)} />
          <input type="password" maxLength="50" placeholder="Contraseña (mínimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="password" maxLength="50" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <input type="tel" maxLength="10" placeholder="Teléfono (10 dígitos)" value={telefono} onChange={e => setTelefono(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-next">Siguiente</button>
        </form>
        <button className="btn-back" onClick={() => navigate('/')}>Volver al Login</button>
      </div>
    </div>
  );
}

export default RegistroPaseadorPaso1;