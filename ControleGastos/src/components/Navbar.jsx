import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;