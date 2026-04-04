import axios from 'axios';
import api from './api';

/**
 * Upload an image file to Cloudinary via the backend upload endpoint.
 * Uses raw axios (not the api instance) so the browser can set the correct
 * multipart/form-data Content-Type boundary automatically.
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('energex_token');
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/upload`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data; // { url, public_id }
};

export const createAdventure = async (payload) => {
  const { data } = await api.post('/api/adventures', payload);
  return data;
};

export const getAllAdventures = async () => {
  const { data } = await api.get('/api/adventures');
  return data;
};

export const getAdventureById = async (id) => {
  const { data } = await api.get(`/api/adventures/${id}`);
  return data;
};

export const getAdventuresByUser = async (userId) => {
  const { data } = await api.get(`/api/adventures/user/${userId}`);
  return data;
};

export const updateAdventure = async (id, payload) => {
  const { data } = await api.put(`/api/adventures/${id}`, payload);
  return data;
};

export const endAdventure = async (id) => {
  const { data } = await api.post(`/api/adventures/${id}/end`);
  return data;
};

export const addMoment = async (id, payload) => {
  const { data } = await api.post(`/api/adventures/${id}/moments`, payload);
  return data;
};

export const updateMoment = async (id, momentId, payload) => {
  const { data } = await api.put(`/api/adventures/${id}/moments/${momentId}`, payload);
  return data;
};

export const deleteMoment = async (id, momentId) => {
  const { data } = await api.delete(`/api/adventures/${id}/moments/${momentId}`);
  return data;
};
