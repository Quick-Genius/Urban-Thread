import api from './api';

export const getAddresses = async () => {
  const response = await api.get('/addresses');
  return response.data;
};

export const createAddress = async (addressData: any) => {
  const response = await api.post('/addresses', addressData);
  return response.data;
};

export const updateAddress = async (addressId: string, addressData: any) => {
  const response = await api.put(`/addresses/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId: string) => {
  const response = await api.delete(`/addresses/${addressId}`);
  return response.data;
};

export const setDefaultAddress = async (addressId: string) => {
  const response = await api.put(`/addresses/${addressId}/default`, {});
  return response.data;
};

export default {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
