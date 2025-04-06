import axios from 'axios';
import { getToken, logout } from '../utils/auth';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized or 403 Forbidden responses
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Authentication error:', error.response.data);
      logout();
    }
    return Promise.reject(error);
  }
);

export default api; 