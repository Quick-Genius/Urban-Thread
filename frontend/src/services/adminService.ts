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

// Dashboard Stats
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/admin/stats`, getAuthHeader());
  return response.data;
};

// Users Management
export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/admin/users`, getAuthHeader());
  return response.data;
};

export const updateUserRole = async (userId: string, role: string) => {
  const response = await axios.put(
    `${API_URL}/admin/users/${userId}/role`,
    { role },
    getAuthHeader()
  );
  return response.data;
};

export const toggleUserStatus = async (userId: string) => {
  const response = await axios.put(
    `${API_URL}/admin/users/${userId}/status`,
    {},
    getAuthHeader()
  );
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(
    `${API_URL}/admin/users/${userId}`,
    getAuthHeader()
  );
  return response.data;
};

// Products Management
export const getAllProducts = async () => {
  const response = await axios.get(`${API_URL}/admin/products`, getAuthHeader());
  return response.data;
};

export const updateProduct = async (productId: string, data: any) => {
  const response = await axios.put(
    `${API_URL}/admin/products/${productId}`,
    data,
    getAuthHeader()
  );
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await axios.delete(
    `${API_URL}/admin/products/${productId}`,
    getAuthHeader()
  );
  return response.data;
};

// Orders Management
export const getAllOrders = async () => {
  const response = await axios.get(`${API_URL}/admin/orders`, getAuthHeader());
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await axios.put(
    `${API_URL}/admin/orders/${orderId}/status`,
    { status },
    getAuthHeader()
  );
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await axios.delete(
    `${API_URL}/admin/orders/${orderId}`,
    getAuthHeader()
  );
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
