import api from './api';

export const updateProfile = async (profileData: any) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const updatePassword = async (passwordData: any) => {
  const response = await api.put('/users/password', passwordData);
  return response.data;
};

export default {
  updateProfile,
  updatePassword,
};
