import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import '../styles/relatorios.css';

const Relatorios = () => {
  const [filtros, setFiltros] = useState({
    categoria: 'todas',
    dataInicio: '',
    dataFim: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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

  // Dados mockados para exemplo
  const dadosVerbas = {
    abastecimento: { verba: 10000, gasto: 4500 },
    correios: { verba: 5000, gasto: 2300 },
    diarias: { verba: 15000, gasto: 8900 },
    materialPermanente: { verba: 20000, gasto: 12000 },
    manutencaoVeiculos: { verba: 8000, gasto: 3500 },
    materialConsumo: { verba: 12000, gasto: 6800 },
  };

  const gerarDadosLancamentos = () => {
    const lancamentos = [];
    const categoriasFiltradas = filtros.categoria === 'todas' 
      ? Object.keys(dadosVerbas) 
      : [filtros.categoria];

    categoriasFiltradas.forEach(categoria => {
      // Simula alguns lançamentos para cada categoria
      for (let i = 0; i < 3; i++) {
        const lancamentoBase = {
          categoria: categorias.find(cat => cat.id === categoria)?.nome,
          data: '2025-02-19',
          valor: Math.random() * 1000,
          solicitante: 'Nome do Solicitante',
          numeroChamado: '',
          justificativa: '',
          destino: '',
          pcdp: '',
          placa: '',
          km: '',
          patrimonio: '',
          numeroRequisicao: '',
          material: '',
          servico: '',
          mes: ''
        };

        // Adiciona campos específicos baseado na categoria
        switch (categoria) {
          case 'abastecimento':
            lancamentoBase.placa = 'ABC-1234';
            lancamentoBase.km = '50000';
            lancamentoBase.patrimonio = '12345';
            lancamentoBase.numeroChamado = 'CHAM-001';
            break;

          case 'correios':
            lancamentoBase.justificativa = 'Envio de documentos';
            lancamentoBase.destino = 'São Paulo';
            break;

          case 'diarias':
            lancamentoBase.justificativa = 'Viagem a trabalho';
            lancamentoBase.pcdp = 'PCDP-001';
            break;

          case 'materialPermanente':
            lancamentoBase.numeroRequisicao = 'REQ-001';
            lancamentoBase.material = 'Computador';
            break;

          case 'manutencaoVeiculos':
            lancamentoBase.placa = 'DEF-5678';
            lancamentoBase.km = '45000';
            lancamentoBase.patrimonio = '67890';
            lancamentoBase.numeroChamado = 'CHAM-002';
            break;

          case 'materialConsumo':
            lancamentoBase.numeroRequisicao = 'REQ-002';
            lancamentoBase.material = 'Material de Escritório';
            break;

          case 'almoxarifado':
            lancamentoBase.numeroRequisicao = 'REQ-003';
            lancamentoBase.material = 'Material de Limpeza';
            break;

          case 'parqueGrafico':
            lancamentoBase.mes = '2025-02';
            break;

          case 'passagens':
            lancamentoBase.justificativa = 'Viagem a trabalho';
            lancamentoBase.pcdp = 'PCDP-002';
            break;

          case 'manutencaoPredial':
            lancamentoBase.servico = 'Manutenção do ar condicionado';
            lancamentoBase.numeroChamado = 'CHAM-003';
            break;

          case 'transportes':
            lancamentoBase.justificativa = 'Transporte de equipamentos';
            lancamentoBase.pcdp = 'PCDP-003';
            break;
        }

        lancamentos.push(lancamentoBase);
      }
    });

    return lancamentos;
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

      // Aqui virá a chamada para a API do backend
      const lancamentos = gerarDadosLancamentos();

      // Criar planilha
      const wb = XLSX.utils.book_new();

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

      // Agrupar lançamentos por categoria
      const lancamentosPorCategoria = lancamentos.reduce((acc, lancamento) => {
        if (!acc[lancamento.categoria]) {
          acc[lancamento.categoria] = [];
        }
        acc[lancamento.categoria].push(lancamento);
        return acc;
      }, {});

      // Criar uma worksheet para cada categoria ou uma única com separadores
      if (filtros.categoria === 'todas') {
        // Criar uma worksheet para cada categoria
        Object.entries(lancamentosPorCategoria).forEach(([categoria, items]) => {
          const headers = headersPorCategoria[categoria];
          
          // Preparar dados específicos da categoria
          const dadosCategoria = items.map(item => {
            const dadosFiltrados = {};
            headers.forEach(header => {
              switch(header) {
                case 'Data': dadosFiltrados[header] = item.data; break;
                case 'Valor': dadosFiltrados[header] = item.valor; break;
                case 'Solicitante': dadosFiltrados[header] = item.solicitante; break;
                case 'Nº Chamado': dadosFiltrados[header] = item.numeroChamado; break;
                case 'Justificativa': dadosFiltrados[header] = item.justificativa; break;
                case 'Destino': dadosFiltrados[header] = item.destino; break;
                case 'PCDP': dadosFiltrados[header] = item.pcdp; break;
                case 'Placa': dadosFiltrados[header] = item.placa; break;
                case 'KM': dadosFiltrados[header] = item.km; break;
                case 'Patrimônio': dadosFiltrados[header] = item.patrimonio; break;
                case 'Nº Requisição': dadosFiltrados[header] = item.numeroRequisicao; break;
                case 'Material': dadosFiltrados[header] = item.material; break;
                case 'Serviço': dadosFiltrados[header] = item.servico; break;
                case 'Mês': dadosFiltrados[header] = item.mes; break;
              }
            });
            return dadosFiltrados;
          });

          // Criar worksheet para a categoria
          const ws = XLSX.utils.json_to_sheet(dadosCategoria, { header: headers });

          // Ajustar largura das colunas
          ws['!cols'] = headers.map(() => ({ wch: 15 }));

          // Adicionar worksheet ao workbook
          XLSX.utils.book_append_sheet(wb, ws, categoria.substring(0, 31)); // Excel limita nome da aba em 31 caracteres
        });
      } else {
        // Criar uma única worksheet para a categoria selecionada
        const categoria = categorias.find(cat => cat.id === filtros.categoria)?.nome;
        const headers = headersPorCategoria[categoria];
        const items = lancamentosPorCategoria[categoria];

        if (items && headers) {
          const dadosCategoria = items.map(item => {
            const dadosFiltrados = {};
            headers.forEach(header => {
              switch(header) {
                case 'Data': dadosFiltrados[header] = item.data; break;
                case 'Valor': dadosFiltrados[header] = item.valor; break;
                case 'Solicitante': dadosFiltrados[header] = item.solicitante; break;
                case 'Nº Chamado': dadosFiltrados[header] = item.numeroChamado; break;
                case 'Justificativa': dadosFiltrados[header] = item.justificativa; break;
                case 'Destino': dadosFiltrados[header] = item.destino; break;
                case 'PCDP': dadosFiltrados[header] = item.pcdp; break;
                case 'Placa': dadosFiltrados[header] = item.placa; break;
                case 'KM': dadosFiltrados[header] = item.km; break;
                case 'Patrimônio': dadosFiltrados[header] = item.patrimonio; break;
                case 'Nº Requisição': dadosFiltrados[header] = item.numeroRequisicao; break;
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
  };;

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
            </div>
          </div>

          <div className="resumo-section">
            <div className="verbas-grid">
              {Object.entries(dadosVerbas).map(([categoria, dados]) => (
                <div key={categoria} className="verba-card">
                  <h3>{categorias.find(cat => cat.id === categoria)?.nome}</h3>
                  <div className="verba-info">
                    <p>Verba Total: R$ {dados.verba.toLocaleString()}</p>
                    <p>Gasto: R$ {dados.gasto.toLocaleString()}</p>
                    <p>Saldo: R$ {(dados.verba - dados.gasto).toLocaleString()}</p>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${(dados.gasto / dados.verba) * 100}%` }}
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