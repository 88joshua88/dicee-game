import axios from 'axios';

/**
 * api — pre-configured Axios instance for all EnergeX API calls.
 *
 * Base URL is read from the VITE_API_URL environment variable so the
 * same codebase works across local, staging, and production environments
 * without any code changes.
 *
 * Usage:
 *   import api from '../services/api';
 *   const { data } = await api.get('/health');
 */
const api = axios.create({
  // In production VITE_API_URL is not set → baseURL becomes '/api' (relative to same host).
  // In development set VITE_API_URL=http://localhost:5000 in client/.env.
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attach JWT Bearer token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('energex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
// Normalise errors into a consistent shape before they bubble up to components
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
