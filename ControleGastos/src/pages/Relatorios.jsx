import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getSaldoGeral } from '../services/saldoService';
import { getLancamentos } from '../services/lancamentoService';
import '../styles/relatorios.css';

const Relatorios = () => {
  const [filtros, setFiltros] = useState({
    categoria: 'todas',
    dataInicio: '',
    dataFim: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verbas, setVerbas] = useState({});

  const categorias = [
    { id: 'todas', nome: 'Todas as Categorias' },
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

  // Carregar saldos ao montar o componente
  useEffect(() => {
    carregarSaldos();
  }, []);

  const carregarSaldos = async () => {
    try {
      setIsLoading(true);
      const saldos = await getSaldoGeral();
      
      // Transformar array de saldos em objeto
      const verbasObj = {};
      saldos.forEach(saldo => {
        const categoriaId = categorias.find(c => c.nome === saldo.categoria)?.id;
        if (categoriaId) {
          verbasObj[categoriaId] = {
            verba: saldo.verba_total,
            gasto: saldo.total_gasto,
            saldo: saldo.saldo_atual
          };
        }
      });
      
      setVerbas(verbasObj);
    } catch (error) {
      console.error('Erro ao carregar saldos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleGerarRelatorio = async () => {
    try {
      setIsLoading(true);

      // Objeto para armazenar lançamentos de todas as categorias
      const todosLancamentos = {};
      
      // Determinar quais categorias buscar
      const categoriasParaBuscar = filtros.categoria === 'todas' 
        ? categorias.filter(c => c.id !== 'todas').map(c => c.id)
        : [filtros.categoria];
      
      // Buscar lançamentos de cada categoria
      for (const categoriaId of categoriasParaBuscar) {
        try {
          // Preparar parâmetros para a consulta
          const params = {};
          
          // Adicionar período de datas se fornecido
          if (filtros.dataInicio) {
            params.dataInicio = filtros.dataInicio;
          }
          
          if (filtros.dataFim) {
            params.dataFim = filtros.dataFim;
          }
          
          // Se não houver data de início ou fim, usar o ano atual como padrão
          if (!params.dataInicio && !params.dataFim) {
            const dataAtual = new Date();
            params.ano = dataAtual.getFullYear();
          }
          
          // Ajuste nos IDs das categorias para corresponder às rotas da API
          const rotaCategoria = categoriaId.replace(/([A-Z])/g, '-$1').toLowerCase();
          
          // Buscar lançamentos com os parâmetros definidos
          const lancamentos = await getLancamentos(rotaCategoria, params);
          const categoriaNome = categorias.find(c => c.id === categoriaId)?.nome;
          
          if (categoriaNome && lancamentos.length > 0) {
            todosLancamentos[categoriaNome] = lancamentos;
          }
        } catch (error) {
          console.error(`Erro ao buscar lançamentos de ${categoriaId}:`, error);
        }
      }

      // Definir cabeçalhos específicos por categoria
      const headersPorCategoria = {
        'Abastecimento': ['Data', 'Placa', 'KM', 'Patrimônio', 'Solicitante', 'Nº Chamado', 'Valor'],
        'Correios': ['Data', 'Valor', 'Solicitante', 'Justificativa', 'Destino'],
        'Diárias': ['Data', 'Justificativa', 'Solicitante', 'PCDP', 'Valor'],
        'Material Permanente': ['Data', 'Nº Requisição', 'Valor', 'Solicitante', 'Material'],
        'Manutenção de Veículos': ['Data', 'Placa', 'KM', 'Patrimônio', 'Solicitante', 'Nº Chamado', 'Valor'],
        'Material de Consumo': ['Data', 'Nº Requisição', 'Valor', 'Solicitante', 'Material'],
        'Almoxarifado': ['Data', 'Nº Requisição', 'Valor', 'Solicitante', 'Material'],
        'Parque Gráfico': ['Mês', 'Valor'],
        'Passagens': ['Data', 'Justificativa', 'Solicitante', 'PCDP', 'Valor'],
        'Manutenção Predial': ['Data', 'Serviço', 'Nº Chamado', 'Valor'],
        'Transportes': ['Data', 'Justificativa', 'Solicitante', 'PCDP', 'Valor']
      };

      // Criar planilha
      const wb = XLSX.utils.book_new();

      // Criar uma worksheet para cada categoria
      if (filtros.categoria === 'todas') {
        Object.entries(todosLancamentos).forEach(([categoria, items]) => {
          if (!items || items.length === 0) return;
          
          const headers = headersPorCategoria[categoria];
          if (!headers) return;
          
          // Mapear campos do backend para o relatório
          const dadosCategoria = items.map(item => {
            const dadosFiltrados = {};
            headers.forEach(header => {
              switch(header) {
                case 'Data': dadosFiltrados[header] = item.data; break;
                case 'Valor': dadosFiltrados[header] = item.valor; break;
                case 'Solicitante': dadosFiltrados[header] = item.solicitante; break;
                case 'Nº Chamado': dadosFiltrados[header] = item.numero_chamado; break;
                case 'Justificativa': dadosFiltrados[header] = item.justificativa; break;
                case 'Destino': dadosFiltrados[header] = item.destino; break;
                case 'PCDP': dadosFiltrados[header] = item.pcdp; break;
                case 'Placa': dadosFiltrados[header] = item.placa; break;
                case 'KM': dadosFiltrados[header] = item.km; break;
                case 'Patrimônio': dadosFiltrados[header] = item.patrimonio; break;
                case 'Nº Requisição': dadosFiltrados[header] = item.numero_requisicao; break;
                case 'Material': dadosFiltrados[header] = item.material; break;
                case 'Serviço': dadosFiltrados[header] = item.servico; break;
                case 'Mês': dadosFiltrados[header] = item.mes; break;
              }
            });
            return dadosFiltrados;
          });

          // Criar worksheet para a categoria
          const ws = XLSX.utils.json_to_sheet(dadosCategoria, { header: headers });
          ws['!cols'] = headers.map(() => ({ wch: 15 }));
          XLSX.utils.book_append_sheet(wb, ws, categoria.substring(0, 31));
        });
      } else {
        // Criar uma única worksheet para a categoria selecionada
        const categoriaNome = categorias.find(cat => cat.id === filtros.categoria)?.nome;
        const headers = headersPorCategoria[categoriaNome];
        const items = todosLancamentos[categoriaNome];

        if (items && headers && items.length > 0) {
          const dadosCategoria = items.map(item => {
            const dadosFiltrados = {};
            headers.forEach(header => {
              switch(header) {
                case 'Data': dadosFiltrados[header] = item.data; break;
                case 'Valor': dadosFiltrados[header] = item.valor; break;
                case 'Solicitante': dadosFiltrados[header] = item.solicitante; break;
                case 'Nº Chamado': dadosFiltrados[header] = item.numero_chamado; break;
                case 'Justificativa': dadosFiltrados[header] = item.justificativa; break;
                case 'Destino': dadosFiltrados[header] = item.destino; break;
                case 'PCDP': dadosFiltrados[header] = item.pcdp; break;
                case 'Placa': dadosFiltrados[header] = item.placa; break;
                case 'KM': dadosFiltrados[header] = item.km; break;
                case 'Patrimônio': dadosFiltrados[header] = item.patrimonio; break;
                case 'Nº Requisição': dadosFiltrados[header] = item.numero_requisicao; break;
                case 'Material': dadosFiltrados[header] = item.material; break;
                case 'Serviço': dadosFiltrados[header] = item.servico; break;
                case 'Mês': dadosFiltrados[header] = item.mes; break;
              }
            });
            return dadosFiltrados;
          });

          const ws = XLSX.utils.json_to_sheet(dadosCategoria, { header: headers });
          ws['!cols'] = headers.map(() => ({ wch: 15 }));
          XLSX.utils.book_append_sheet(wb, ws, "Lançamentos");
        } else {
          // Se não houver lançamentos, criar planilha vazia
          const ws = XLSX.utils.json_to_sheet([]);
          XLSX.utils.book_append_sheet(wb, ws, "Sem Lançamentos");
        }
      }

      // Gerar arquivo
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Gerar nome do arquivo com data
      const fileName = `relatorio_${filtros.categoria}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Download do arquivo
      saveAs(data, fileName);

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relatorios-container">
      <div className="relatorios-content">
        <h1>Relatórios e Verbas</h1>

        <div className="relatorios-layout">
          <div className="filtros-section">
            <h2>Filtros</h2>
            <div className="filtros-content">
              <div className="form-group">
                <label>Categoria</label>
                <select
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                >
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Data Início</label>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Data Fim</label>
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
                />
              </div>

              <button 
                onClick={handleGerarRelatorio} 
                className="gerar-button"
                disabled={isLoading}
              >
                {isLoading ? 'Gerando...' : 'Gerar Relatório Excel'}
              </button>
              
              <button 
                onClick={carregarSaldos} 
                className="gerar-button"
                disabled={isLoading}
                style={{ marginTop: '10px', backgroundColor: '#6c757d' }}
              >
                Atualizar Dados
              </button>
            </div>
          </div>

          <div className="resumo-section">
            <div className="verbas-grid">
              {Object.entries(verbas).map(([categoria, dados]) => (
                <div key={categoria} className="verba-card">
                  <h3>{categorias.find(cat => cat.id === categoria)?.nome}</h3>
                  <div className="verba-info">
                    <p>Verba Total: R$ {dados.verba.toLocaleString()}</p>
                    <p>Gasto: R$ {dados.gasto.toLocaleString()}</p>
                    <p>Saldo: R$ {dados.saldo.toLocaleString()}</p>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ 
                        width: `${(dados.gasto / dados.verba) * 100}%`,
                        backgroundColor: dados.gasto > dados.verba ? '#dc3545' : '#4a90e2'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;