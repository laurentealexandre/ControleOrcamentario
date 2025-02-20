import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/categorias.css';

const Abastecimento = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data: '',
    placa: '',
    km: '',
    patrimonio: '',
    solicitante: '',
    numeroChamado: '',
    valorAbastecido: ''
  });

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do abastecimento:', formData);
    // Aqui iremos implementar a lógica para salvar os dados
  };

  return (
    <div className="categoria-container">
      <div className="categoria-content">
        <div className="categoria-header">
          <h1>Abastecimento</h1>
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
              <label>Placa</label>
              <input
                type="text"
                value={formData.placa}
                onChange={(e) => handleChange('placa', e.target.value)}
                placeholder="Digite a placa"
              />
            </div>

            <div className="form-group">
              <label>Quilometragem</label>
              <input
                type="number"
                value={formData.km}
                onChange={(e) => handleChange('km', e.target.value)}
                placeholder="Digite a quilometragem"
              />
            </div>

            <div className="form-group">
              <label>Patrimônio</label>
              <input
                type="text"
                value={formData.patrimonio}
                onChange={(e) => handleChange('patrimonio', e.target.value)}
                placeholder="Digite o patrimônio"
              />
            </div>

            <div className="form-group">
              <label>Solicitante</label>
              <input
                type="text"
                value={formData.solicitante}
                onChange={(e) => handleChange('solicitante', e.target.value)}
                placeholder="Digite o solicitante"
              />
            </div>

            <div className="form-group">
              <label>Nº Chamado</label>
              <input
                type="text"
                value={formData.numeroChamado}
                onChange={(e) => handleChange('numeroChamado', e.target.value)}
                placeholder="Digite o número do chamado"
              />
            </div>

            <div className="form-group">
              <label>Valor Abastecido</label>
              <input
                type="number"
                value={formData.valorAbastecido}
                onChange={(e) => handleChange('valorAbastecido', e.target.value)}
                placeholder="R$ 0,00"
                step="0.01"
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

export default Abastecimento;