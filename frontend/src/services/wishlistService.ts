import api from './api';

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId: string) => {
  const response = await api.post(`/wishlist/${productId}`, {});
  return response.data;
};

export const removeFromWishlist = async (productId: string) => {
  const response = await api.delete(`/wishlist/${productId}`);
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
