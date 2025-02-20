import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/categorias.css';

const ManutencaoPredial = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    servico: '',
    valor: '',
    data: '',
    numeroChamado: ''  // Novo campo adicionado
  });

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados da manutenção predial:', formData);
  };

  return (
    <div className="categoria-container">
      <div className="categoria-content">
        <div className="categoria-header">
          <h1>Manutenção Predial</h1>
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
              <label>Nº do Chamado</label>
              <input
                type="text"
                value={formData.numeroChamado}
                onChange={(e) => handleChange('numeroChamado', e.target.value)}
                placeholder="Digite o número do chamado"
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
              <label>Serviço</label>
              <input
                type="text"
                value={formData.servico}
                onChange={(e) => handleChange('servico', e.target.value)}
                placeholder="Descreva o serviço realizado"
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

export default ManutencaoPredial;