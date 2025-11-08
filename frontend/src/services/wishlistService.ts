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

export const getWishlist = async () => {
  const response = await axios.get(`${API_URL}/wishlist`, getAuthHeader());
  return response.data;
};

export const addToWishlist = async (productId: string) => {
  const response = await axios.post(
    `${API_URL}/wishlist/${productId}`,
    {},
    getAuthHeader()
  );
  return response.data;
};

export const removeFromWishlist = async (productId: string) => {
  const response = await axios.delete(
    `${API_URL}/wishlist/${productId}`,
    getAuthHeader()
  );
  return response.data;
};

export const toggleWishlist = async (productId: string, isInWishlist: boolean) => {
  if (isInWishlist) {
    return await removeFromWishlist(productId);
  } else {
    return await addToWishlist(productId);
  }
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
};
