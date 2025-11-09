import api from './api';

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId: string, quantity: number, size: string) => {
  const response = await api.post('/cart', { productId, quantity, size });
  return response.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const response = await api.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (itemId: string) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
