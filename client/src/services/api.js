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
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attach auth token once authentication is built (token will live in context)
api.interceptors.request.use(
  (config) => {
    // TODO (Auth phase): attach Bearer token from context/localStorage
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
