import api from './api';

// Dashboard Stats
export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// Users Management
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (userId: string, role: string) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const toggleUserStatus = async (userId: string) => {
  const response = await api.put(`/admin/users/${userId}/status`, {});
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Products Management
export const getAllProducts = async () => {
  const response = await api.get('/admin/products');
  return response.data;
};

export const updateProduct = async (productId: string, data: any) => {
  const response = await api.put(`/admin/products/${productId}`, data);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data;
};

// Orders Management
export const getAllOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await api.delete(`/admin/orders/${orderId}`);
  return response.data;
};

export default {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
