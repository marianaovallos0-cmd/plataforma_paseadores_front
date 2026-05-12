import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsuarios, getPaseadores, setSesionActual } from '../services/api';
import { ROLES } from '../constants';
import { mostrarAlerta } from '../utils/alerts';
import '../styles/pages/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(ROLES.DUENO);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    const usuarios = rol === ROLES.DUENO ? getUsuarios() : getPaseadores();

    if (usuarios.length === 0) {
      setError(`No hay ${rol === ROLES.DUENO ? 'dueños' : 'paseadores'} registrados. Crea una cuenta primero.`);
      return;
    }

    // Codificar la contraseña ingresada para comparar
    const passwordEncoded = btoa(password);
    const encontrado = usuarios.find(u => u.correo === email.trim() && u.password === passwordEncoded);

    if (encontrado) {
      // Eliminar la contraseña antes de guardar en sesión
      const { password: _, ...usuarioSinPassword } = encontrado;
      const sesion = { ...usuarioSinPassword, rol };

      setSesionActual(sesion);
      login(sesion);

      navigate(rol === ROLES.DUENO ? '/dashboard' : '/dashboard-paseador');
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  const handleCrearCuenta = () => {
    navigate(rol === ROLES.DUENO ? '/registro/paso1' : '/registro-paseador/paso1');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>INICIAR SESIÓN</h2>
        <div className="profile-placeholder"><div className="profile-circle">🐕</div></div>
        <div className="rol-tabs">
          <button className={`tab-btn ${rol === ROLES.DUENO ? 'active' : ''}`} onClick={() => setRol(ROLES.DUENO)}>Dueño</button>
          <button className={`tab-btn ${rol === ROLES.PASEADOR ? 'active' : ''}`} onClick={() => setRol(ROLES.PASEADOR)}>Paseador</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-login">Iniciar Sesión</button>
        </form>
        <div className="register-divider"><span>¿No tienes una cuenta?</span></div>
        <button className="btn-register" onClick={handleCrearCuenta}>Crear cuenta como {rol === ROLES.DUENO ? 'Dueño' : 'Paseador'}</button>
      </div>
    </div>
  );
}

export default Login;