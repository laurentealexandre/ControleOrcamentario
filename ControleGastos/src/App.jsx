import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import GestaoVerbas from './pages/GestaoVerbas';
import Relatorios from './pages/Relatorios';
import Abastecimento from './pages/Abastecimento';
import Correios from './pages/Correios';
import Diarias from './pages/Diarias';
import MaterialPermanente from './pages/MaterialPermanente';
import ManutencaoVeiculos from './pages/ManutencaoVeiculos';
import MaterialConsumo from './pages/MaterialConsumo';
import Almoxarifado from './pages/Almoxarifado';
import ParqueGrafico from './pages/ParqueGrafico';
import Passagens from './pages/Passagens';
import ManutencaoPredial from './pages/ManutencaoPredial';
import Transportes from './pages/Transportes';
import GerenciarUsuarios from './pages/GerenciarUsuarios';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verbas" element={<GestaoVerbas />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/categoria/abastecimento" element={<Abastecimento />} />
        <Route path="/categoria/correios" element={<Correios />} />
        <Route path="/categoria/diarias" element={<Diarias />} />
        <Route path="/categoria/materialPermanente" element={<MaterialPermanente />} />
        <Route path="/categoria/manutencaoVeiculos" element={<ManutencaoVeiculos />} />
        <Route path="/categoria/materialConsumo" element={<MaterialConsumo />} />
        <Route path="/categoria/almoxarifado" element={<Almoxarifado />} />
        <Route path="/categoria/parqueGrafico" element={<ParqueGrafico />} />
        <Route path="/categoria/passagens" element={<Passagens />} />
        <Route path="/categoria/manutencaoPredial" element={<ManutencaoPredial />} />
        <Route path="/categoria/transportes" element={<Transportes />} />
        <Route path="/usuarios" element={<GerenciarUsuarios />} />
      </Routes>
    </Router>
  );
}

export default App;