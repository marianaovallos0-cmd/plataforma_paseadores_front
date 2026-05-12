import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistroPaso1 from './pages/RegistroPaso1';
import RegistroPaso2 from './pages/RegistroPaso2';
import RegistroPaso3 from './pages/RegistroPaso3';
import RegistroPaso4 from './pages/RegistroPaso4';
import Configuracion from './pages/Configuracion';   // ← nueva
import Pagos from './pages/Pagos';
import MiHistorial from './pages/MiHistorial';
import SolicitarPaseo from './pages/SolicitarPaseo';
import RegistroPaseadorPaso1 from './pages/Paseador/RegistroPaseadorPaso1';
import RegistroPaseadorPaso2 from './pages/Paseador/RegistroPaseadorPaso2';
import RegistroPaseadorPaso3 from './pages/Paseador/RegistroPaseadorPaso3';
import DashboardPaseador from './pages/Paseador/DashboardPaseador';
import HorariosPaseador from './pages/Paseador/HorariosPaseador';
import HistorialPaseador from './pages/Paseador/HistorialPaseador';
import ConfiguracionPaseador from './pages/Paseador/ConfiguracionPaseador';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro/paso1" element={<RegistroPaso1 />} />
        <Route path="/registro/ubicacion" element={<RegistroPaso2 />} />
        <Route path="/registro/mascotas" element={<RegistroPaso3 />} />
        <Route path="/registro/confirmacion" element={<RegistroPaso4 />} />
        <Route path="/configuracion" element={<Configuracion />} />   {/* ← nueva */}
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/historial" element={<MiHistorial />} />
        <Route path="/solicitar-paseo" element={<SolicitarPaseo />} />
        <Route path="/registro-paseador/paso1" element={<RegistroPaseadorPaso1 />} />
        <Route path="/registro-paseador/paso2" element={<RegistroPaseadorPaso2 />} />
        <Route path="/registro-paseador/paso3" element={<RegistroPaseadorPaso3 />} />
        <Route path="/dashboard-paseador" element={<DashboardPaseador />} />
        <Route path="/horarios-paseador" element={<HorariosPaseador />} />
        <Route path="/historial-paseador" element={<HistorialPaseador />} />
        <Route path="/configuracion-paseador" element={<ConfiguracionPaseador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;