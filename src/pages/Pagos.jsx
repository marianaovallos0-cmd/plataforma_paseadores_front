import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import MenuLateral from '../components/MenuLateral';
import { useAuth } from '../context/AuthContext';
import { getSolicitudes } from '../services/api';
import '../styles/pages/Pagos.css';

function Pagos() {
  const { user: usuario, loading } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [historial, setHistorial] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !usuario) {
      navigate('/');
      return;
    }
    if (usuario) {
      const solicitudes = getSolicitudes();
      const pagos = solicitudes
        .filter(s => s.idDueño === usuario.id && s.estado === 'finalizada')
        .map(s => {
          let fechaLegible = 'Fecha no disponible';
          if (s.fechaHora) {
            const fechaObj = new Date(s.fechaHora);
            if (!isNaN(fechaObj.getTime())) {
              fechaLegible = fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            } else if (s.fecha) {
              const fechaObj2 = new Date(s.fecha);
              if (!isNaN(fechaObj2.getTime())) fechaLegible = fechaObj2.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            }
          }
          return {
            id: s.id,
            fecha: fechaLegible,
            servicio: 'Paseo',
            paseador: 'Paseador asignado',
            mascota: s.nombreMascota || (s.mascotas ? s.mascotas.map(m => m.nombre).join(', ') : 'Mascota no especificada'),
            total: s.precioTotal || 0,
          };
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setHistorial(pagos);
    }
  }, [usuario, loading, navigate]);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  if (loading) return <div>Cargando...</div>;
  if (!usuario) return null;

  return (
    <div className="pagos-container">
      <div className="pagos-header">
        <button className="menu-toggle" onClick={toggleMenu}><FaBars /></button>
        <div className="user-info">
          <span>{usuario.nombreCompleto}</span>
          {usuario.fotoPerfil ? <img src={usuario.fotoPerfil} alt="foto" className="user-avatar-img" /> : <FaUserCircle className="user-avatar" />}
        </div>
      </div>
      <div className="pagos-main">
        <MenuLateral menuAbierto={menuAbierto} />
        <div className="pagos-content">
          <h2 className="pagos-title">Historial de Pagos</h2>
          <div className="tabla-container">
            <table className="tabla-pagos">
              <thead>
                <tr><th>Fecha</th><th>Servicio</th><th>Paseador</th><th>Mascota</th><th>Total</th></tr>
              </thead>
              <tbody>
                {historial.length === 0 ? <tr><td colSpan="5" className="sin-datos">No hay pagos registrados</td></tr> :
                  historial.map(pago => (
                    <tr key={pago.id}>
                      <td>{pago.fecha}</td>
                      <td>{pago.servicio}</td>
                      <td>{pago.paseador}</td>
                      <td>{pago.mascota}</td>
                      <td>${pago.total.toLocaleString()} COP</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagos;