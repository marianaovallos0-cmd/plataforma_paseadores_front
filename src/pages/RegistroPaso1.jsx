import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarNombre, validarEmail, validarPassword, validarTelefono, getErrorMessage } from '../utils/validaciones';
import { getUsuarios } from '../services/api';
import '../styles/pages/RegistroPaso1.css';

function RegistroPaso1() {
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
    // Verificar si el correo ya existe
    const usuarios = getUsuarios();
    if (usuarios.some(u => u.correo === correo.trim())) {
      setError('Este correo ya está registrado. Inicia sesión.');
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
    localStorage.setItem('tempRegistro', JSON.stringify(tempData));
    navigate('/registro/ubicacion');
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2>CREAR CUENTA</h2>
        <div className="profile-placeholder"><div className="profile-circle">📝</div></div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Primer nombre *" maxLength="50" value={primerNombre} onChange={e => setPrimerNombre(e.target.value)} />
          <input type="text" placeholder="Segundo nombre (opcional)" maxLength="50" value={segundoNombre} onChange={e => setSegundoNombre(e.target.value)} />
          <input type="text" placeholder="Primer apellido *" maxLength="50" value={primerApellido} onChange={e => setPrimerApellido(e.target.value)} />
          <input type="text" placeholder="Segundo apellido (opcional)" maxLength="50" value={segundoApellido} onChange={e => setSegundoApellido(e.target.value)} />
          <input type="email" placeholder="Correo electrónico *" maxLength="100" value={correo} onChange={e => setCorreo(e.target.value)} />
          <input type="tel" placeholder="Teléfono (10 dígitos) *" maxLength="10" value={telefono} onChange={e => setTelefono(e.target.value)} />
          <input type="password" placeholder="Contraseña (mínimo 6 caracteres) *" maxLength="50" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirmar Contraseña *" maxLength="50" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-next">Siguiente</button>
        </form>
        <button className="btn-back" onClick={() => navigate('/')}>Volver al Login</button>
      </div>
    </div>
  );
}

export default RegistroPaso1;