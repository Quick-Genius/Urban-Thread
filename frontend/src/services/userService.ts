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

export const updateProfile = async (profileData: any) => {
  const response = await axios.put(`${API_URL}/users/profile`, profileData, getAuthHeader());
  return response.data;
};

export const updatePassword = async (passwordData: any) => {
  const response = await axios.put(`${API_URL}/users/password`, passwordData, getAuthHeader());
  return response.data;
};

export default {
  updateProfile,
  updatePassword,
};
