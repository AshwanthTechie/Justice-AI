import axios from 'axios';
import { getToken, isTokenExpired, removeToken } from './tokenUtils';
import { API_CONFIG } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // Increased timeout for AI responses and case searches
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && isTokenExpired(token)) {
      // Token expired, remove it
      removeToken();
      // Optionally redirect to login
      window.location.href = '/login';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const reqUrl = error.config?.url || '';
    if (status === 401) {
      // Do not auto-redirect for authentication endpoints (login/register)
      const authPaths = [API_CONFIG.ENDPOINTS.USER.LOGIN, API_CONFIG.ENDPOINTS.USER.ADD];
      const isAuthRequest = authPaths.some(p => reqUrl.includes(p));
      if (!isAuthRequest) {
        // Unauthorized - token might be invalid
        removeToken();
        // Optionally redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
