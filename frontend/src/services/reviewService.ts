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

export const getProductReviews = async (productId: string) => {
  const response = await axios.get(`${API_URL}/reviews/${productId}`);
  return response.data;
};

export const createReview = async (productId: string, reviewData: { rating: number; comment: string }) => {
  const response = await axios.post(
    `${API_URL}/reviews/${productId}`,
    reviewData,
    getAuthHeader()
  );
  return response.data;
};

export const updateReview = async (reviewId: string, reviewData: { rating: number; comment: string }) => {
  const response = await axios.put(
    `${API_URL}/reviews/${reviewId}`,
    reviewData,
    getAuthHeader()
  );
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await axios.delete(
    `${API_URL}/reviews/${reviewId}`,
    getAuthHeader()
  );
  return response.data;
};

export default {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
