import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/categorias.css';

const Transportes = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    justificativa: '',
    solicitante: '',
    pcdp: '',
    valor: '',
    data: ''
  });

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados dos transportes:', formData);
  };

  return (
    <div className="categoria-container">
      <div className="categoria-content">
        <div className="categoria-header">
          <h1>Transportes</h1>
          <button onClick={() => navigate('/verbas')} className="voltar-button">
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="categoria-form">
          <div className="form-grid">
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
              <label>PCDP</label>
              <input
                type="text"
                value={formData.pcdp}
                onChange={(e) => handleChange('pcdp', e.target.value)}
                placeholder="Digite o número da PCDP"
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
              <label>Justificativa</label>
              <input
                type="text"
                value={formData.justificativa}
                onChange={(e) => handleChange('justificativa', e.target.value)}
                placeholder="Digite a justificativa"
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

export default Transportes;