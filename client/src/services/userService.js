import axios from 'axios';
import api from './api';

/**
 * Upload a profile picture to Cloudinary via the backend upload endpoint.
 * Uses raw axios to avoid the JSON Content-Type header conflict.
 */
export const uploadAvatar = async (file) => {
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

/**
 * Update the authenticated user's profile fields.
 * Returns the updated user object.
 */
export const updateProfile = async (payload) => {
  const { data } = await api.put('/auth/profile', payload);
  return data.user;
};

/**
 * Change the authenticated user's password.
 * Requires currentPassword and newPassword.
 */
export const updatePassword = async (payload) => {
  const { data } = await api.put('/auth/password', payload);
  return data;
};
