import { useState } from 'react';
import { validarNumeroTarjeta, validarFechaExpiracion } from '../../utils/validacionesTarjeta';
import { validarTitularTarjeta, getErrorMessage } from '../../utils/validaciones';
import '../../styles/Configuracion/ModalEditarTarjeta.css';

function ModalEditarTarjeta({ isOpen, onClose, tarjeta, onGuardar }) {
  const [numero, setNumero] = useState(tarjeta.numeroCompleto || '');
  const [titular, setTitular] = useState(tarjeta.titular);
  const [fechaExpiracion, setFechaExpiracion] = useState(tarjeta.fechaExpiracion);
  const [cvv, setCvv] = useState(tarjeta.cvv);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleNumeroChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 16) valor = valor.slice(0, 16);
    let formateado = '';
    for (let i = 0; i < valor.length; i += 4) {
      if (i > 0) formateado += ' ';
      formateado += valor.slice(i, i + 4);
    }
    setNumero(formateado);
  };

  const handleFechaChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 4) valor = valor.slice(0, 4);
    if (valor.length === 2 && !valor.includes('/')) {
      valor = valor + '/';
    }
    if (valor.length >= 3 && !valor.includes('/')) {
      valor = valor.slice(0, 2) + '/' + valor.slice(2);
    }
    setFechaExpiracion(valor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!numero || !titular || !fechaExpiracion || !cvv) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (!validarTitularTarjeta(titular)) {
      setError(getErrorMessage('titularTarjeta'));
      return;
    }
    const numeroLimpio = numero.replace(/\s/g, '');
    if (!validarNumeroTarjeta(numeroLimpio)) {
      setError('Número de tarjeta inválido');
      return;
    }
    if (!validarFechaExpiracion(fechaExpiracion)) {
      setError('Fecha de expiración inválida o vencida');
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError('CVV debe tener 3 o 4 dígitos');
      return;
    }

    const tarjetaActualizada = {
      ...tarjeta,
      numero: `**** ${numeroLimpio.slice(-4)}`,
      numeroCompleto: numeroLimpio,
      titular: titular.trim(),
      fechaExpiracion,
      cvv,
    };
    onGuardar(tarjetaActualizada);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Editar Tarjeta</h3>
        <form onSubmit={handleSubmit}>
          <label>Número de la Tarjeta</label>
          <input
            type="text"
            maxLength="19"
            placeholder="4588 0000 0000 0000"
            value={numero}
            onChange={handleNumeroChange}
          />
          <label>Nombre del propietario</label>
          <input
            type="text"
            maxLength="80"
            placeholder="Ej: Albert Torres"
            value={titular}
            onChange={e => setTitular(e.target.value)}
          />
          <div className="row-fields">
            <div className="field-group">
              <label>Fecha de Expiración</label>
              <input
                type="text"
                maxLength="5"
                placeholder="MM/AA"
                value={fechaExpiracion}
                onChange={handleFechaChange}
              />
            </div>
            <div className="field-group">
              <label>CVV</label>
              <input
                type="text"
                maxLength="4"
                placeholder="***"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
              />
            </div>
          </div>
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

export default ModalEditarTarjeta;