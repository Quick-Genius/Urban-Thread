import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Module-level token getter set by ClerkTokenSync in App.tsx.
 * Clerk tokens are short-lived JWTs — we retrieve a fresh one per request.
 */
let _getToken: (() => Promise<string | null>) | null = null;

export const setClerkTokenGetter = (fn: () => Promise<string | null>) => {
  _getToken = fn;
};

api.interceptors.request.use(
  async (config) => {
    if (_getToken) {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 from our backend means the Clerk session is invalid/expired
    // Clerk's SDK will handle redirecting to sign-in automatically
    return Promise.reject(error);
  },
);

export default api;
