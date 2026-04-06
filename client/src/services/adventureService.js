import axios from 'axios';
import api from './api';

// In production VITE_API_URL is not set → resolves to '/api/upload' (same host).
// In development set VITE_API_URL=http://localhost:5000 in client/.env.
const UPLOAD_URL = `${import.meta.env.VITE_API_URL || ''}/api/upload`;

/**
 * Upload an image file to Cloudinary via the backend upload endpoint.
 * Uses raw axios (not the api instance) so the browser can set the correct
 * multipart/form-data Content-Type boundary automatically.
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('energex_token');
  const { data } = await axios.post(UPLOAD_URL, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // { url, public_id }
};

// NOTE: paths below are relative to the api instance's baseURL (/api).
// Do NOT add an /api prefix here — that would produce /api/api/adventures.

export const createAdventure = async (payload) => {
  const { data } = await api.post('/adventures', payload);
  return data;
};

export const getAllAdventures = async () => {
  const { data } = await api.get('/adventures');
  return data;
};

export const getAdventureById = async (id) => {
  const { data } = await api.get(`/adventures/${id}`);
  return data;
};

export const getAdventuresByUser = async (userId) => {
  const { data } = await api.get(`/adventures/user/${userId}`);
  return data;
};

export const updateAdventure = async (id, payload) => {
  const { data } = await api.put(`/adventures/${id}`, payload);
  return data;
};

export const endAdventure = async (id) => {
  const { data } = await api.post(`/adventures/${id}/end`);
  return data;
};

export const addMoment = async (id, payload) => {
  const { data } = await api.post(`/adventures/${id}/moments`, payload);
  return data;
};

export const updateMoment = async (id, momentId, payload) => {
  const { data } = await api.put(`/adventures/${id}/moments/${momentId}`, payload);
  return data;
};

export const deleteMoment = async (id, momentId) => {
  const { data } = await api.delete(`/adventures/${id}/moments/${momentId}`);
  return data;
};
