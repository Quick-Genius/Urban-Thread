import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getAllProducts = async (params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string;
  rating?: number;
  search?: string;
  sort?: string;
}) => {
  const response = await axios.get(`${API_URL}/products`, { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (category: string) => {
  const response = await axios.get(`${API_URL}/products`, {
    params: { category },
  });
  return response.data;
};

export const searchProducts = async (query: string) => {
  const response = await axios.get(`${API_URL}/products`, {
    params: { search: query },
  });
  return response.data;
};

export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
};
