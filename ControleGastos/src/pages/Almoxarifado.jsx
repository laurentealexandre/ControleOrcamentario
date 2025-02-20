import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/categorias.css';

const Almoxarifado = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numeroRequisicao: '',
    valor: '',
    solicitante: '',
    data: '',
    material: ''
  });

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do almoxarifado:', formData);
  };

  return (
    <div className="categoria-container">
      <div className="categoria-content">
        <div className="categoria-header">
          <h1>Almoxarifado</h1>
          <button onClick={() => navigate('/verbas')} className="voltar-button">
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="categoria-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nº da Requisição</label>
              <input
                type="text"
                value={formData.numeroRequisicao}
                onChange={(e) => handleChange('numeroRequisicao', e.target.value)}
                placeholder="Digite o número da requisição"
              />
            </div>

            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => handleChange('data', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Solicitante</label>
              <input
                type="text"
                value={formData.solicitante}
                onChange={(e) => handleChange('solicitante', e.target.value)}
                placeholder="Digite o nome do solicitante"
              />
            </div>

            <div className="form-group">
              <label>Valor</label>
              <input
                type="number"
                value={formData.valor}
                onChange={(e) => handleChange('valor', e.target.value)}
                placeholder="R$ 0,00"
                step="0.01"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => handleChange('material', e.target.value)}
                placeholder="Descreva o material"
              />
            </div>
          </div>

          <button type="submit" className="save-button">
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Almoxarifado;