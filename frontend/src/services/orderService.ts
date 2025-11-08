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

export const getMyOrders = async () => {
  const response = await axios.get(`${API_URL}/orders/my-orders`, getAuthHeader());
  return response.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await axios.get(`${API_URL}/orders/${orderId}`, getAuthHeader());
  return response.data;
};

export default {
  getMyOrders,
  getOrderById,
};
