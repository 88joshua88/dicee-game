import axios from 'axios';
import api from './api';

/**
 * articleService — all API calls for the Article resource.
 */

/**
 * uploadImage — uploads a file to Cloudinary via the backend upload endpoint.
 * Uses a fresh axios call (not the JSON api instance) so the browser can set
 * the correct multipart/form-data Content-Type with boundary.
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

/** Create a new article (includes version 1 content) */
export const createArticle = async (articleData) => {
  const { data } = await api.post('/articles', articleData);
  return data.article;
};

/** Fetch all articles (for marketplace) */
export const getAllArticles = async () => {
  const { data } = await api.get('/articles');
  return data.articles;
};

/** Fetch a single article with full version content */
export const getArticleById = async (id) => {
  const { data } = await api.get(`/articles/${id}`);
  return data.article;
};

/** Fetch all articles by a specific user */
export const getArticlesByUser = async (userId) => {
  const { data } = await api.get(`/articles/user/${userId}`);
  return data.articles;
};

/** Update article metadata (title, description, image, price) */
export const updateArticleMetadata = async (id, metadata) => {
  const { data } = await api.put(`/articles/${id}`, metadata);
  return data.article;
};

/** Append a new version to an article (30-day rule enforced by server) */
export const createNewVersion = async (id, content) => {
  const { data } = await api.post(`/articles/${id}/new-version`, { content });
  return data.article;
};
