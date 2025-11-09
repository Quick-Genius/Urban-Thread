import api from './api';

export const getProductReviews = async (productId: string) => {
  const response = await api.get(`/reviews/${productId}`);
  return response.data;
};

export const createReview = async (productId: string, reviewData: { rating: number; comment: string }) => {
  const response = await api.post(`/reviews/${productId}`, reviewData);
  return response.data;
};

export const updateReview = async (reviewId: string, reviewData: { rating: number; comment: string }) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

export default {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
