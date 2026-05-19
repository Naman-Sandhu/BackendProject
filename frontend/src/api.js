import axios from 'axios';

const RENDER_API_BASE_URL = 'https://backendproject-u6cx.onrender.com';
const LOCALHOST_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i;

const resolveApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  if (import.meta.env.PROD) {
    if (
      configuredUrl &&
      !LOCALHOST_RE.test(configuredUrl) &&
      configuredUrl !== currentOrigin
    ) {
      return configuredUrl;
    }

    return RENDER_API_BASE_URL;
  }

  return configuredUrl || 'http://localhost:3000';
};

export const API_BASE_URL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getApiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const getMediaUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

export default API_BASE_URL;
