import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaSave, FaEdit, FaStar, FaRegStar } from 'react-icons/fa';
import MenuLateral from '../../components/MenuLateral';
import { useAuth } from '../../context/AuthContext';
import { updatePaseador, setSesionActual } from '../../services/api';
import { validarNombre, validarEmail, validarTelefono, getErrorMessage } from '../../utils/validaciones';
import { mostrarAlerta, confirmarAccion } from '../../utils/alerts';
import '../../styles/pages/ConfiguracionPaseador.css';
import Loader from '@/components/Loader';

function ConfiguracionPaseador() {
  const { user: paseador, loading, login } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !paseador) {
      navigate('/');
      return;
    }
    if (paseador) {
      setNombre(paseador.nombreCompleto);
      setCorreo(paseador.correo);
      setTelefono(paseador.telefono || '');
      setFotoPerfil(paseador.fotoPerfil || '');
      setPreview(paseador.fotoPerfil || '');
    }
  }, [paseador, loading, navigate]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfil(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const guardarCambios = async () => {
    setError('');
    if (!validarNombre(nombre)) {
      setError(getErrorMessage('nombre'));
      return;
    }
    if (!validarEmail(correo)) {
      setError(getErrorMessage('email'));
      return;
    }
    if (telefono.trim() && !validarTelefono(telefono)) {
      setError(getErrorMessage('telefono'));
      return;
    }
    const confirmed = await confirmarAccion('Guardar cambios', '¿Deseas actualizar tu perfil?');
    if (confirmed) {
      const updated = { ...paseador, nombreCompleto: nombre, correo, telefono: telefono.trim(), fotoPerfil };
      updatePaseador(paseador.id, updated);
      setSesionActual(updated);
      login(updated);
      setEditando(false);
      mostrarAlerta('Perfil actualizado', 'Cambios guardados correctamente', 'success');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <FaStar key={i} className="star filled" /> : <FaRegStar key={i} className="star empty" />);
    }
    return stars;
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  if (loading) return <Loader/>;
  if (!paseador) return null;

  return (
    <div className="config-paseador-container">
      <div className="dashboard-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="user-info">
          <span>{paseador.nombreCompleto}</span>
          {paseador.fotoPerfil ? <img src={paseador.fotoPerfil} alt="foto" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
        </div>
      </div>
      <div className="dashboard-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="config-content">
          <div className="perfil-header">
            <h2>Mi perfil</h2>
            {!editando && <button className="btn-editar" onClick={() => setEditando(true)}><FaEdit /> Editar</button>}
          </div>

          {!editando ? (
            // Modo vista
            <div className="perfil-grid">
              <div className="avatar-section">
                {preview ? <img src={preview} alt="perfil" className="foto-grande" /> : <div className="foto-placeholder">🐕‍🦺</div>}
              </div>
              <div className="info-section">
                <div className="info-item"><label>Nombre</label><div className="valor">{paseador.nombreCompleto}</div></div>
                <div className="info-item"><label>Correo</label><div className="valor">{paseador.correo}</div></div>
                <div className="info-item"><label>Teléfono</label><div className="valor">{paseador.telefono || 'No registrado'}</div></div>
                <div className="info-item"><label>Calificación</label><div className="valor estrellas">{renderStars(paseador.calificacionPromedio || 0)}</div></div>
                <div className="acciones-secundarias">
                  <button className="btn-secundario" onClick={() => mostrarAlerta('Próximamente', 'Cambio de contraseña disponible pronto', 'info')}>Cambiar Contraseña</button>
                  <button className="btn-secundario" onClick={() => mostrarAlerta('Próximamente', 'Cerrar sesiones activas disponible pronto', 'info')}>Cerrar sesiones activas</button>
                </div>
              </div>
            </div>
          ) : (
            // Modo edición
            <div className="edit-grid">
              <div className="avatar-section">
                {preview ? <img src={preview} alt="perfil" className="foto-grande" /> : <div className="foto-placeholder">🐕‍🦺</div>}
                <label className="btn-cambiar-foto">
                  Cambiar foto
                  <input type="file" accept="image/*" onChange={handleFotoChange} style={{ display: 'none' }} />
                </label>
              </div>
              <div className="edit-fields">
                <input type="text" maxLength="100" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} />
                <input type="email" maxLength="100" placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} />
                <input type="tel" maxLength="10" placeholder="Teléfono (10 dígitos)" value={telefono} onChange={e => setTelefono(e.target.value)} />
                {error && <div className="error">{error}</div>}
                <div className="edit-actions">
                  <button className="btn-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
                  <button className="btn-guardar" onClick={guardarCambios}><FaSave /> Guardar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionPaseador;