import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add interceptor to inject token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const apiService = {
  get: async (url: string) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { success: false, message: error.message };
    }
  },
  
  post: async (url: string, data: any) => {
    try {
      const config: any = {};
      if (data instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { success: false, message: error.message };
    }
  },
  
  put: async (url: string, data: any) => {
    try {
      const config: any = {};
      if (data instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { success: false, message: error.message };
    }
  },
  
  delete: async (url: string) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { success: false, message: error.message };
    }
  },
  
  login: async (email: string, password: string) => {
    return apiService.post('/auth/login', { email, password });
  },
  
  register: async (userData: any) => {
    return apiService.post('/auth/register', userData);
  },
  
  logout: async () => {
    return apiService.post('/auth/logout', {});
  }
};

export default apiService;
