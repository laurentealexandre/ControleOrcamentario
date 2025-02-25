import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLancamento, getLancamentos } from '../services/lancamentoService';
import '../styles/categorias.css';

const ParqueGrafico = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mes: '',
    valor: ''
  });
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLancamentos = async () => {
      try {
        setLoading(true);
        const data = await getLancamentos('parque-grafico');
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
      await createLancamento('parque-grafico', formData);
      
      // Limpar formulário
      setFormData({
        mes: '',
        valor: ''
      });
      
      // Recarregar lançamentos
      const data = await getLancamentos('parque-grafico');
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
          <h1>Parque Gráfico</h1>
          <button onClick={() => navigate('/verbas')} className="voltar-button">
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="categoria-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Mês</label>
              <input
                type="month"
                value={formData.mes}
                onChange={(e) => handleChange('mes', e.target.value)}
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
                  <th>Mês</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.mes).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</td>
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

export default ParqueGrafico;