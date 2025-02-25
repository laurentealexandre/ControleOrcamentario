import api from './api';

export const getSaldoGeral = async () => {
  const response = await api.get('/saldos');
  return response.data;
};

export const getSaldoCategoria = async (categoriaId, ano, mes) => {
  const response = await api.get(`/saldos/categoria/${categoriaId}?ano=${ano}&mes=${mes}`);
  return response.data;
};