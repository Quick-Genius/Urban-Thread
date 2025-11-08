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

export const getCart = async () => {
  const response = await axios.get(`${API_URL}/cart`, getAuthHeader());
  return response.data;
};

export const addToCart = async (productId: string, quantity: number, size: string) => {
  const response = await axios.post(
    `${API_URL}/cart`,
    { productId, quantity, size },
    getAuthHeader()
  );
  return response.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const response = await axios.put(
    `${API_URL}/cart/${itemId}`,
    { quantity },
    getAuthHeader()
  );
  return response.data;
};

export const removeFromCart = async (itemId: string) => {
  const response = await axios.delete(
    `${API_URL}/cart/${itemId}`,
    getAuthHeader()
  );
  return response.data;
};

export const clearCart = async () => {
  const response = await axios.delete(`${API_URL}/cart`, getAuthHeader());
  return response.data;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
