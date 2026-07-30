import axios from 'axios';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      const token = (session?.user as any)?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting session:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        toast.error('Session expired. Please login again.');
        window.location.href = '/auth/login';
      }
    }

    // Show error toast for non-401 errors
    if (error.response?.status !== 401 && error.response?.data?.message) {
      toast.error(error.response.data.message);
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
