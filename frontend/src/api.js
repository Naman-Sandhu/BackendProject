import axios from 'axios';

const RENDER_API_BASE_URL = 'https://backendproject-u6cx.onrender.com';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? RENDER_API_BASE_URL : 'http://localhost:3000');

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getApiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const getMediaUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

export default API_BASE_URL;
