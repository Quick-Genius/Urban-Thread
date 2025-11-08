import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAddresses = async () => {
  const response = await axios.get(`${API_URL}/addresses`, getAuthHeader());
  return response.data;
};

export const createAddress = async (addressData: any) => {
  const response = await axios.post(`${API_URL}/addresses`, addressData, getAuthHeader());
  return response.data;
};

export const updateAddress = async (addressId: string, addressData: any) => {
  const response = await axios.put(`${API_URL}/addresses/${addressId}`, addressData, getAuthHeader());
  return response.data;
};

export const deleteAddress = async (addressId: string) => {
  const response = await axios.delete(`${API_URL}/addresses/${addressId}`, getAuthHeader());
  return response.data;
};

export const setDefaultAddress = async (addressId: string) => {
  const response = await axios.put(`${API_URL}/addresses/${addressId}/default`, {}, getAuthHeader());
  return response.data;
};

export default {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
