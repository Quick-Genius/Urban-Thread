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

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Get ImageKit auth parameters
export const getAuthParams = async () => {
  const response = await axios.get(`${API_URL}/upload/auth`, getAuthHeader());
  return response.data;
};

// Upload single image
export const uploadImage = async (file: File, folder: string = '/products') => {
  const base64 = await fileToBase64(file);
  
  const response = await axios.post(
    `${API_URL}/upload`,
    {
      file: base64,
      fileName: file.name,
      folder,
    },
    getAuthHeader()
  );
  
  return response.data;
};

// Upload multiple images
export const uploadMultipleImages = async (files: File[], folder: string = '/products') => {
  const base64Files = await Promise.all(
    files.map(async (file) => ({
      data: await fileToBase64(file),
      name: file.name,
    }))
  );

  const response = await axios.post(
    `${API_URL}/upload/multiple`,
    {
      files: base64Files,
      folder,
    },
    getAuthHeader()
  );

  return response.data;
};

// Delete image
export const deleteImage = async (fileId: string) => {
  const response = await axios.delete(
    `${API_URL}/upload/${fileId}`,
    getAuthHeader()
  );
  return response.data;
};

export default {
  getAuthParams,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};
