import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLancamento, getLancamentos } from '../services/lancamentoService';
import '../styles/categorias.css';

const Diarias = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data: '',
    justificativa: '',
    solicitante: '',
    pcdp: '',
    valor: ''
  });
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLancamentos = async () => {
      try {
        setLoading(true);
        const data = await getLancamentos('diarias');
        setLancamentos(data);
      } catch (error) {
        console.error('Erro ao buscar lançamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLancamentos();
  }, []);

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createLancamento('diarias', formData);
      
      // Limpar formulário
      setFormData({
        data: '',
        justificativa: '',
        solicitante: '',
        pcdp: '',
        valor: ''
      });
      
      // Recarregar lançamentos
      const data = await getLancamentos('diarias');
      setLancamentos(data);
      
      alert('Lançamento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar lançamento:', error);
      alert('Erro ao criar lançamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categoria-container">
      <div className="categoria-content">
        <div className="categoria-header">
          <h1>Diárias</h1>
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
                required
              />
            </div>

            <div className="form-group">
              <label>Solicitante</label>
              <input
                type="text"
                value={formData.solicitante}
                onChange={(e) => handleChange('solicitante', e.target.value)}
                placeholder="Digite o nome do solicitante"
                required
              />
            </div>

            <div className="form-group">
              <label>PCDP</label>
              <input
                type="text"
                value={formData.pcdp}
                onChange={(e) => handleChange('pcdp', e.target.value)}
                placeholder="Digite o número da PCDP"
                required
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
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Justificativa</label>
              <textarea
                value={formData.justificativa}
                onChange={(e) => handleChange('justificativa', e.target.value)}
                placeholder="Digite a justificativa"
                required
              />
            </div>
          </div>

          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>

        <div className="lancamentos-section">
          <h2>Lançamentos Recentes</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : lancamentos.length === 0 ? (
            <p>Nenhum lançamento encontrado.</p>
          ) : (
            <table className="lancamentos-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Solicitante</th>
                  <th>PCDP</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.data).toLocaleDateString()}</td>
                    <td>{item.solicitante}</td>
                    <td>{item.pcdp}</td>
                    <td>R$ {parseFloat(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diarias;