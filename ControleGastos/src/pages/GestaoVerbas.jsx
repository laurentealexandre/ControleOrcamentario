import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVerbas, updateVerba } from '../services/verbaService';
import { getSaldoGeral } from '../services/saldoService';
import '../styles/gestaoVerbas.css';

const GestaoVerbas = () => {
  const navigate = useNavigate();
  const [editandoVerba, setEditandoVerba] = useState(null);
  const [verbas, setVerbas] = useState({});
  const [novaVerba, setNovaVerba] = useState('');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const saldos = await getSaldoGeral();
        
        // Transformar array de saldos em objeto para fácil acesso
        const saldosObj = {};
        saldos.forEach(saldo => {
          const categoriaId = categorias.find(c => c.nome === saldo.categoria)?.id;
          if (categoriaId) {
            saldosObj[categoriaId] = {
              total: saldo.verba_total,
              gasto: saldo.total_gasto,
              saldo: saldo.saldo_atual
            };
          }
        });
        
        setVerbas(saldosObj);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleEditarVerba = (categoriaId) => {
    setEditandoVerba(categoriaId);
    setNovaVerba(verbas[categoriaId]?.total.toString() || '0');
  };

  const handleSalvarVerba = async () => {
    if (editandoVerba) {
      try {
        // Aqui você precisaria do ID da verba para atualizar
        // Para simplificar, pode-se criar uma nova verba com o valor atualizado
        const valorTotal = parseFloat(novaVerba) || 0;
        const anoAtual = new Date().getFullYear();
        const mesAtual = new Date().getMonth() + 1;
        
        // Obter o ID da categoria a partir do nome da categoria
        const categoriaObj = categorias.find(c => c.id === editandoVerba);
        const categoriaId = categoriaObj?.id; // Isso é o ID da tabela categorias no BD
        
        if (categoriaId) {
          // Atualizar a verba no backend
          await updateVerba(categoriaId, {
            valor_total: valorTotal,
            ano: anoAtual,
            mes: mesAtual
          });
          
          // Atualizar o estado local
          setVerbas(prev => ({
            ...prev,
            [editandoVerba]: {
              ...prev[editandoVerba],
              total: valorTotal
            }
          }));
        }
      } catch (error) {
        console.error('Erro ao salvar verba:', error);
      }
      
      setEditandoVerba(null);
      setNovaVerba('');
    }
  };

  const handleCancelarEdicao = () => {
    setEditandoVerba(null);
    setNovaVerba('');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

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
                    <p>Verba Total: R$ {verbas[categoria.id]?.total.toLocaleString() || '0,00'}</p>
                    <p>Gasto: R$ {verbas[categoria.id]?.gasto.toLocaleString() || '0,00'}</p>
                    <p>Saldo: R$ {verbas[categoria.id]?.saldo.toLocaleString() || '0,00'}</p>
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
                    width: `${verbas[categoria.id] ? (verbas[categoria.id].gasto / verbas[categoria.id].total) * 100 : 0}%`,
                    backgroundColor: verbas[categoria.id] && verbas[categoria.id].gasto > verbas[categoria.id].total ? '#dc3545' : '#4a90e2'
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