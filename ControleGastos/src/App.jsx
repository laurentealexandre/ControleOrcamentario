import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import GestaoVerbas from './pages/GestaoVerbas';
import Relatorios from './pages/Relatorios';
import PrivateRoute from './components/PrivateRoute';
// ... importações de páginas de categorias

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/verbas" element={
          <PrivateRoute>
            <GestaoVerbas />
          </PrivateRoute>
        } />
        
        <Route path="/relatorios" element={
          <PrivateRoute>
            <Relatorios />
          </PrivateRoute>
        } />
        
        {/* Rotas para categorias */}
        <Route path="/categoria/:categoria" element={
          <PrivateRoute>
            <CategoriaPage />
          </PrivateRoute>
        } />
        
        {/* ... outras rotas protegidas */}
      </Routes>
    </Router>
  );
}

export default App;