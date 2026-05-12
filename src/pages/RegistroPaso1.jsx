import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarNombre, validarEmail, validarPassword, getErrorMessage } from '../utils/validaciones';
import { getUsuarios } from '../services/api';
import '../styles/pages/RegistroPaso1.css';

function RegistroPaso1() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    const usuarios = getUsuarios();
    if (usuarios.some(u => u.correo === correo.trim())) {
      setError('Este correo ya está registrado. Inicia sesión.');
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
      nombreCompleto: nombreCompleto.trim(),
      correo: correo.trim(),
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
          <input type="text" placeholder="Nombre Completo" maxLength="100" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} />
          <input type="email" placeholder="Correo" maxLength="100" value={correo} onChange={e => setCorreo(e.target.value)} />
          <input type="password" placeholder="Contraseña (mínimo 6 caracteres)" maxLength="50" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirmar Contraseña" maxLength="50" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-next">Siguiente</button>
        </form>
        <button className="btn-back" onClick={() => navigate('/')}>Volver al Login</button>
      </div>
    </div>
  );
}

export default RegistroPaso1;