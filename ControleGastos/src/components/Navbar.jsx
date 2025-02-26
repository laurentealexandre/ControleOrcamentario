import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/';

  const handleLogout = () => {
    // Remover token do localStorage (ou sessionStorage)
    localStorage.removeItem('token');
    
    // Outros dados que você queira limpar ao sair
    localStorage.removeItem('user');
    
    // Redirecionar para a página de login
    navigate('/');
  };

  if (isLoginPage) return null;

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/verbas" className="nav-brand">
          Controle de Gastos
        </Link>
        <div className="nav-links">
          <Link to="/verbas" className="nav-link">Verbas</Link>
          <Link to="/relatorios" className="nav-link">Relatórios</Link>
          <Link to="/usuarios" className="nav-link">Usuários</Link>
          <button onClick={handleLogout} className="nav-link btn-sair">Sair</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;