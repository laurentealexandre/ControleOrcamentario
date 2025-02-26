import React, { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVerbas, updateVerba, createVerba } from '../services/verbaService';
import { getSaldoGeral } from '../services/saldoService';
import '../styles/gestaoVerbas.css';

// Componente de Error Boundary para capturar erros
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado pelo boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '5px' }}>
          <h2>Algo deu errado</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Detalhes do erro</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Componente Stack: {this.state.errorInfo && this.state.errorInfo.componentStack}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Função de formatação segura
const formatarNumero = (valor) => {
  if (valor === undefined || valor === null) {
    return '0,00';
  }
  
  if (typeof valor !== 'number') {
    valor = Number(valor) || 0;
  }
  
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Componente principal de conteúdo
const GestaoVerbasContent = () => {
  const navigate = useNavigate();
  const [editandoVerba, setEditandoVerba] = useState(null);
  const [verbas, setVerbas] = useState({});
  const [novaVerba, setNovaVerba] = useState('');
  const [loading, setLoading] = useState(true);
  const [verbasPorCategoria, setVerbasPorCategoria] = useState({});
  const [anoAtual] = useState(new Date().getFullYear());
  const [mesAtual] = useState(new Date().getMonth() + 1);

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

  // Função para carregar dados (pode ser chamada para atualizar)
  const carregarDados = async () => {
    try {
      console.log("Iniciando carregamento de dados...");
      setLoading(true);
      
      // Carregamos primeiro todas as verbas do servidor
      const todasVerbas = await getAllVerbas();
      console.log("Verbas carregadas do servidor:", todasVerbas);
      
      // Filtrar verbas para o ano/mês atual
      const verbasDoMesAtual = todasVerbas.filter(verba => 
        verba.ano === anoAtual && verba.mes === mesAtual
      );
      
      console.log(`Verbas do mês atual (${mesAtual}/${anoAtual}):`, verbasDoMesAtual);
      
      // Mapear verbas por categoria
      const verbasMapeadas = {};
      const saldosObj = {};
      
      // Inicializar objetos vazios para todas as categorias
      categorias.forEach(cat => {
        saldosObj[cat.id] = {
          total: 0,
          gasto: 0,
          saldo: 0
        };
      });
      
      // Preencher com os dados das verbas do mês atual
      verbasDoMesAtual.forEach(verba => {
        // Encontrar a categoria correspondente pelo nome
        const categoria = categorias.find(c => 
          c.nome === verba.categoria_nome
        );
        
        if (categoria) {
          // Guardar a verba por categoria para uso posterior
          verbasMapeadas[categoria.id] = verba;
          
          // Atualizar os valores no objeto de saldos
          saldosObj[categoria.id] = {
            total: verba.valor_total || 0,
            gasto: 0,
            saldo: verba.valor_total || 0
          };
        }
      });
      
      console.log("Mapeamento de verbas por categoria:", verbasMapeadas);
      setVerbasPorCategoria(verbasMapeadas);
      
      // Tentar obter dados adicionais do getSaldoGeral (se estiver disponível)
      try {
        const saldos = await getSaldoGeral();
        console.log("Saldos carregados:", saldos);
        
        if (saldos && saldos.length > 0) {
          // Atualizar apenas as informações de gastos e saldos
          saldos.forEach(saldo => {
            const categoriaId = categorias.find(c => c.nome === saldo.categoria)?.id;
            if (categoriaId && saldosObj[categoriaId]) {
              saldosObj[categoriaId].gasto = saldo.total_gasto || 0;
              saldosObj[categoriaId].saldo = saldo.saldo_atual || 0;
            }
          });
        }
      } catch (saldoError) {
        console.error("Erro ao carregar saldos:", saldoError);
      }
      
      setVerbas(saldosObj);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar dados na inicialização
  useEffect(() => {
    carregarDados();
  }, []);

  const handleEditarVerba = (categoriaId) => {
    console.log(`Iniciando edição da verba para categoria: ${categoriaId}`);
    setEditandoVerba(categoriaId);
    setNovaVerba((verbas[categoriaId]?.total || 0).toString());
  };

  const handleSalvarVerba = async () => {
    console.log(`Salvando verba para categoria: ${editandoVerba}`);
    if (editandoVerba) {
      try {
        const valorTotal = parseFloat(novaVerba) || 0;
        console.log(`Novo valor: ${valorTotal}`);
        
        // Obter a categoria e verificar se temos uma verba mapeada para ela
        const categoriaObj = categorias.find(c => c.id === editandoVerba);
        const verbaExistente = verbasPorCategoria[editandoVerba];
        
        if (categoriaObj) {
          console.log(`Categoria encontrada: ${categoriaObj.nome}`);
          
          if (verbaExistente && verbaExistente.id) {
            console.log(`Verba encontrada com ID: ${verbaExistente.id}`);
            
            // Atualizar a verba no servidor usando o ID correto
            await updateVerba(verbaExistente.id, {
              valor_total: valorTotal
            });
            
            console.log(`Verba com ID ${verbaExistente.id} atualizada no servidor com sucesso`);
          } else {
            console.log(`Não foi encontrada verba para a categoria ${categoriaObj.nome}. Criando nova verba.`);
            
            // Encontrar o ID numérico correto da categoria
            let categoriaServerId;
            switch (categoriaObj.id) {
              case 'abastecimento': categoriaServerId = 1; break;
              case 'correios': categoriaServerId = 2; break;
              case 'diarias': categoriaServerId = 3; break;
              case 'materialPermanente': categoriaServerId = 4; break;
              case 'manutencaoVeiculos': categoriaServerId = 5; break;
              case 'materialConsumo': categoriaServerId = 6; break;
              case 'almoxarifado': categoriaServerId = 7; break;
              case 'parqueGrafico': categoriaServerId = 8; break;
              case 'passagens': categoriaServerId = 9; break;
              case 'manutencaoPredial': categoriaServerId = 10; break;
              case 'transportes': categoriaServerId = 11; break;
              default: 
                console.error(`ID da categoria não mapeado: ${categoriaObj.id}`);
                throw new Error('ID da categoria não mapeado');
            }
            
            // Criar uma nova verba para o mês atual
            const novaVerbaResult = await createVerba({
              categoria_id: categoriaServerId,
              valor_total: valorTotal,
              ano: anoAtual,
              mes: mesAtual
            });
            
            console.log(`Nova verba criada com sucesso, ID: ${novaVerbaResult.id}`);
          }
          
          // Após salvar, recarregar os dados
          await carregarDados();
          
          alert(`Verba para ${categoriaObj.nome} atualizada com sucesso!`);
        }
      } catch (error) {
        console.error('Erro ao salvar verba:', error);
        alert('Ocorreu um erro ao salvar a verba. Verifique o console para mais detalhes.');
      }
      
      setEditandoVerba(null);
      setNovaVerba('');
    }
  };

  const handleCancelarEdicao = () => {
    console.log("Cancelando edição");
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
        <div className="periodo-info">
          <p>Período: {mesAtual}/{anoAtual}</p>
          <button onClick={carregarDados} className="btn-recarregar">
            Atualizar Dados
          </button>
        </div>
        
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
                    <p>Verba Total: R$ {formatarNumero(verbas[categoria.id]?.total)}</p>
                    <p>Gasto: R$ {formatarNumero(verbas[categoria.id]?.gasto)}</p>
                    <p>Saldo: R$ {formatarNumero(verbas[categoria.id]?.saldo)}</p>
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
                    width: `${verbas[categoria.id] && verbas[categoria.id].total > 0 ? (verbas[categoria.id].gasto / verbas[categoria.id].total) * 100 : 0}%`,
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

// Componente principal que envolve o conteúdo com o Error Boundary
const GestaoVerbas = () => {
  return (
    <ErrorBoundary>
      <GestaoVerbasContent />
    </ErrorBoundary>
  );
};

export default GestaoVerbas;