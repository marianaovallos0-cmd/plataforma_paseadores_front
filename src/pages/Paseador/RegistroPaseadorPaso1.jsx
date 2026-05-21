import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarNombre, validarEmail, validarPassword, validarTelefono, getErrorMessage } from '../../utils/validaciones';
import { getPaseadores } from '../../services/api';
import { mostrarAlerta } from '../../utils/alerts';
import '../../styles/pages/RegistroPaseador.css';

function RegistroPaseadorPaso1() {
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validarNombre(primerNombre)) {
      setError('Primer nombre: solo letras, mínimo 3 caracteres');
      return;
    }
    if (!validarNombre(primerApellido)) {
      setError('Primer apellido: solo letras, mínimo 3 caracteres');
      return;
    }
    if (segundoNombre && !validarNombre(segundoNombre)) {
      setError('Segundo nombre: solo letras, mínimo 3 caracteres');
      return;
    }
    if (segundoApellido && !validarNombre(segundoApellido)) {
      setError('Segundo apellido: solo letras, mínimo 3 caracteres');
      return;
    }
    if (!validarEmail(correo)) {
      setError(getErrorMessage('email'));
      return;
    }
    if (!validarTelefono(telefono)) {
      setError(getErrorMessage('telefono'));
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

    const tempData = {
      primerNombre: primerNombre.trim(),
      segundoNombre: segundoNombre.trim(),
      primerApellido: primerApellido.trim(),
      segundoApellido: segundoApellido.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      password,
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
          <input type="text" maxLength="50" placeholder="Primer nombre *" value={primerNombre} onChange={e => setPrimerNombre(e.target.value)} />
          <input type="text" maxLength="50" placeholder="Segundo nombre (opcional)" value={segundoNombre} onChange={e => setSegundoNombre(e.target.value)} />
          <input type="text" maxLength="50" placeholder="Primer apellido *" value={primerApellido} onChange={e => setPrimerApellido(e.target.value)} />
          <input type="text" maxLength="50" placeholder="Segundo apellido (opcional)" value={segundoApellido} onChange={e => setSegundoApellido(e.target.value)} />
          <input type="email" maxLength="100" placeholder="Correo electrónico *" value={correo} onChange={e => setCorreo(e.target.value)} />
          <input type="tel" maxLength="10" placeholder="Teléfono (10 dígitos) *" value={telefono} onChange={e => setTelefono(e.target.value)} />
          <input type="password" maxLength="50" placeholder="Contraseña (mínimo 6) *" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="password" maxLength="50" placeholder="Confirmar contraseña *" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-next">Siguiente</button>
        </form>
        <button className="btn-back" onClick={() => navigate('/')}>Volver al Login</button>
      </div>
    </div>
  );
}

export default RegistroPaseadorPaso1;