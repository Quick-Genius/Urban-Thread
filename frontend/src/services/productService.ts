import api from './api';

export const getAllProducts = async (params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string;
  rating?: number;
  search?: string;
  sort?: string;
}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (category: string) => {
  const response = await api.get('/products', { params: { category } });
  return response.data;
};

export const searchProducts = async (query: string) => {
  const response = await api.get('/products', { params: { search: query } });
  return response.data;
};

export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
};
