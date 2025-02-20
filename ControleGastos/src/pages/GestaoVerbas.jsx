import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/gestaoVerbas.css';

const GestaoVerbas = () => {
  const navigate = useNavigate();
  const [editandoVerba, setEditandoVerba] = useState(null);
  const [verbas, setVerbas] = useState({
    abastecimento: { total: 10000, gasto: 4500 },
    correios: { total: 5000, gasto: 2300 },
    diarias: { total: 15000, gasto: 8900 },
    materialPermanente: { total: 20000, gasto: 12000 },
    manutencaoVeiculos: { total: 8000, gasto: 3500 },
    materialConsumo: { total: 12000, gasto: 6800 },
    almoxarifado: { total: 9000, gasto: 4200 },
    parqueGrafico: { total: 7000, gasto: 3000 },
    passagens: { total: 25000, gasto: 15000 },
    manutencaoPredial: { total: 30000, gasto: 18000 },
    transportes: { total: 18000, gasto: 9000 }
  });
  const [novaVerba, setNovaVerba] = useState('');

  const categorias = [
    { id: 'abastecimento', nome: 'Abastecimento' },
    { id: 'correios', nome: 'Correios' },
    { id: 'diarias', nome: 'Diárias' },
    { id: 'materialPermanente', nome: 'Material Permanente' },
    { id: 'manutencaoVeiculos', nome: 'Manutenção de Veículos' },
    { id: 'materialConsumo', nome: 'Material de Consumo' },
    { id: 'almoxarifado', nome: 'Almoxarifado' },
    { id: 'parqueGrafico', nome: 'Parque Gráfico' },
    { id: 'passagens', nome: 'Passagens' },
    { id: 'manutencaoPredial', nome: 'Manutenção Predial' },
    { id: 'transportes', nome: 'Transportes' }
  ];

  const handleEditarVerba = (categoriaId) => {
    setEditandoVerba(categoriaId);
    setNovaVerba(verbas[categoriaId].total.toString());
  };

  const handleSalvarVerba = () => {
    if (editandoVerba) {
      setVerbas(prev => ({
        ...prev,
        [editandoVerba]: {
          ...prev[editandoVerba],
          total: parseFloat(novaVerba) || 0
        }
      }));
      setEditandoVerba(null);
      setNovaVerba('');
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoVerba(null);
    setNovaVerba('');
  };

  return (
    <div className="verbas-container">
      <div className="verbas-content">
        <h1>Gestão de Verbas</h1>
        
        <div className="verbas-grid">
          {categorias.map(categoria => (
            <div key={categoria.id} className="verba-card">
              <h3>{categoria.nome}</h3>
              <div className="verba-info">
                {editandoVerba === categoria.id ? (
                  <div className="edicao-verba">
                    <input
                      type="number"
                      value={novaVerba}
                      onChange={(e) => setNovaVerba(e.target.value)}
                      placeholder="Nova verba"
                      className="input-verba"
                    />
                    <div className="botoes-edicao">
                      <button onClick={handleSalvarVerba} className="btn-salvar">
                        Salvar
                      </button>
                      <button onClick={handleCancelarEdicao} className="btn-cancelar">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>Verba Total: R$ {verbas[categoria.id].total.toLocaleString()}</p>
                    <p>Gasto: R$ {verbas[categoria.id].gasto.toLocaleString()}</p>
                    <p>Saldo: R$ {(verbas[categoria.id].total - verbas[categoria.id].gasto).toLocaleString()}</p>
                    <div className="botoes-verba">
                      <button 
                        onClick={() => handleEditarVerba(categoria.id)}
                        className="btn-editar"
                      >
                        Editar Verba
                      </button>
                      <button 
                        onClick={() => navigate(`/categoria/${categoria.id}`)}
                        className="btn-cadastrar"
                      >
                        Cadastrar Gastos
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ 
                    width: `${(verbas[categoria.id].gasto / verbas[categoria.id].total) * 100}%`,
                    backgroundColor: verbas[categoria.id].gasto > verbas[categoria.id].total ? '#dc3545' : '#4a90e2'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GestaoVerbas;