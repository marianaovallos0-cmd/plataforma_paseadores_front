import { useState, useEffect } from 'react';

function InputEdad({ value, onChange, onBlur, error }) {
  const [numero, setNumero] = useState('');
  const [unidad, setUnidad] = useState('años');

  useEffect(() => {
    if (value) {
      const parts = value.split(' ');
      if (parts.length === 2) {
        setNumero(parts[0]);
        setUnidad(parts[1]);
      } else {
        setNumero('');
        setUnidad('años');
      }
    } else {
      setNumero('');
      setUnidad('años');
    }
  }, [value]);

  const maxNumero = unidad === 'años' ? 30 : 11;
  const minNumero = 1;

  const handleNumeroChange = (e) => {
    let newNumero = e.target.value;
    if (newNumero === '') {
      setNumero('');
      onChange({ target: { value: '' } });
      return;
    }
    let num = parseInt(newNumero, 10);
    if (isNaN(num)) return;
    if (num > maxNumero) num = maxNumero;
    if (num < minNumero) num = minNumero;
    setNumero(num);
    if (unidad) {
      onChange({ target: { value: `${num} ${unidad}` } });
    }
  };

  const handleUnidadChange = (e) => {
    const newUnidad = e.target.value;
    setUnidad(newUnidad);
    if (numero) {
      let num = parseInt(numero, 10);
      const newMax = newUnidad === 'años' ? 30 : 11;
      if (num > newMax) num = newMax;
      setNumero(num);
      onChange({ target: { value: `${num} ${newUnidad}` } });
    } else {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input
        type="number"
        min={minNumero}
        max={maxNumero}
        step="1"
        placeholder="Edad (ej: 3)"
        value={numero}
        onChange={handleNumeroChange}
        onBlur={onBlur}
        style={{ flex: 1, padding: '10px', border: '2px solid #ddd', borderRadius: '12px' }}
      />
      <select
        value={unidad}
        onChange={handleUnidadChange}
        onBlur={onBlur}
        style={{ flex: 1, padding: '10px', border: '2px solid #ddd', borderRadius: '12px', backgroundColor: 'white' }}
      >
        <option value="años">años</option>
        <option value="meses">meses</option>
      </select>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
export default InputEdad;