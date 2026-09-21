import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

/**
 * Axios-based API client for the Hijauin backend.
 *
 * - Auth token injected from localStorage via request interceptor
 * - Errors normalized to ApiError shape (TRD §3)
 * - Base URL configurable via env
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ── Request interceptor: attach auth token ────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor: normalize errors ────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.data) {
      // Backend returned a structured error — pass it through
      return Promise.reject(error.response.data);
    }

    // Network error or timeout — build a synthetic ApiError
    const apiError: ApiError = {
      statusCode: error.response?.status ?? 0,
      success: false,
      message: error.message || 'Network error',
      errors: [],
      timestamp: new Date().toISOString(),
    };
    return Promise.reject(apiError);
  },
);

export { api };
export default api;
