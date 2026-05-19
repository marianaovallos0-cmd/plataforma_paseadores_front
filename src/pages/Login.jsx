import authApi from '@/core/infrastructure/api/auth.api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants';
import '../styles/pages/Login.css';
import { setSesionActual } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(ROLES.DUENO);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);

      const data = await authApi.login({ email, password });
      localStorage.setItem('token', data.token);

      const user = data.usuario;

      // Determinar el rol principal del usuario
      let userRol = null;
      if (user.roles.some(r => r.idRol === ROLES.DUENO)) userRol = ROLES.DUENO;
      else if (user.roles.some(r => r.idRol === ROLES.PASEADOR)) userRol = ROLES.PASEADOR;
      else userRol = ROLES.ADMIN;

      const sesion = { ...user, roles: user.roles, rol: userRol };

      setSesionActual(sesion);
      login(sesion);

      if (userRol === ROLES.DUENO) navigate('/dashboard');
      else if (userRol === ROLES.PASEADOR) navigate('/dashboard-paseador');
      else navigate('/');
    } catch (error) {
      const errorCustom = error;
      setError(errorCustom.message);
    } finally {
      setLoading(false);
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