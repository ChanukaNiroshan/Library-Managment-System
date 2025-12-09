import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006/api';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    console.log('=== API Request ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Token exists:', !!token);
    console.log('Token value:', token?.substring(0, 20) + '...');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.warn('No token found in localStorage!');
    }
    
    console.log('Request headers:', config.headers);
    console.log('Request data:', config.data);
    console.log('==================');
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('=== API Response ===');
    console.log('Status:', response.status);
    console.log('URL:', response.config.url);
    console.log('Data:', response.data);
    console.log('===================');
    return response;
  },
  (error: AxiosError) => {
    console.error('=== API Error ===');
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
    console.error('Response data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('=================');
    
    if (error.response?.status === 401) {
      console.error('Unauthorized! Token might be expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Prevent redirect loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;