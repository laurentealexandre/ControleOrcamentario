import api from './api';

// Função genérica para criar lançamentos de qualquer categoria
export const createLancamento = async (categoria, lancamentoData) => {
  const response = await api.post(`/lancamentos/${categoria}`, lancamentoData);
  return response.data;
};

// Função genérica para obter lançamentos de qualquer categoria
export const getLancamentos = async (categoria, ano, mes) => {
  let url = `/lancamentos/${categoria}`;
  if (ano && mes) {
    url += `?ano=${ano}&mes=${mes}`;
  }
  const response = await api.get(url);
  return response.data;
};

// Função genérica para obter um lançamento específico
export const getLancamentoById = async (categoria, id) => {
  const response = await api.get(`/lancamentos/${categoria}/${id}`);
  return response.data;
};

// Função genérica para atualizar lançamentos
export const updateLancamento = async (categoria, id, lancamentoData) => {
  const response = await api.put(`/lancamentos/${categoria}/${id}`, lancamentoData);
  return response.data;
};

// Função genérica para deletar lançamentos
export const deleteLancamento = async (categoria, id) => {
  const response = await api.delete(`/lancamentos/${categoria}/${id}`);
  return response.data;
};