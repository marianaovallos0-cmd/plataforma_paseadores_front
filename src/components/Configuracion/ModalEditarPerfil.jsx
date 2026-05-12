import { useState } from 'react';
import { validarNombre, validarEmail, validarTelefono, getErrorMessage } from '../../utils/validaciones';
import '../../styles/configuracion/ModalEditarPerfil.css';

function ModalEditarPerfil({ isOpen, onClose, usuario, onGuardar }) {
  const [nombre, setNombre] = useState(usuario.nombreCompleto || '');
  const [correo, setCorreo] = useState(usuario.correo || '');
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [fotoPerfil, setFotoPerfil] = useState(usuario.fotoPerfil || '');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(usuario.fotoPerfil || '');

  if (!isOpen) return null;

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    const usuarioActualizado = {
      ...usuario,
      nombreCompleto: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      fotoPerfil: fotoPerfil || '',
    };
    onGuardar(usuarioActualizado);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Editar Perfil</h3>
        <form onSubmit={handleSubmit}>
          <div className="foto-perfil-container">
            <div className="foto-preview">
              {preview ? <img src={preview} alt="Foto de perfil" className="foto-preview-img" /> : <div className="foto-placeholder">🐕</div>}
            </div>
            <label className="btn-cambiar-foto">
              Cambiar foto
              <input type="file" accept="image/*" onChange={handleFotoChange} style={{ display: 'none' }} />
            </label>
          </div>
          <label>Nombre Completo</label>
          <input type="text" maxLength="100" value={nombre} onChange={e => setNombre(e.target.value)} />
          <label>Correo electrónico</label>
          <input type="email" maxLength="100" value={correo} onChange={e => setCorreo(e.target.value)} />
          <label>Teléfono (10 dígitos, opcional)</label>
          <input type="tel" maxLength="10" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="3001234567" />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-buttons">
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-enviar">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarPerfil;