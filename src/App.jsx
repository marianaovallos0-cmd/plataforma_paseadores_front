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
import AppRouter from './core/router';


function App() {
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;