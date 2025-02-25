import api from './api';

export const getAllVerbas = async () => {
  const response = await api.get('/verbas');
  return response.data;
};

export const getVerbaById = async (id) => {
  const response = await api.get(`/verbas/${id}`);
  return response.data;
};

export const createVerba = async (verbaData) => {
  const response = await api.post('/verbas', verbaData);
  return response.data;
};

export const updateVerba = async (id, verbaData) => {
  const response = await api.put(`/verbas/${id}`, verbaData);
  return response.data;
};

export const deleteVerba = async (id) => {
  const response = await api.delete(`/verbas/${id}`);
  return response.data;
};