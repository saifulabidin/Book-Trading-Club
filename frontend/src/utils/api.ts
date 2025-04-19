import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from './constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: '',
      status: error.response?.status || 500,
      errors: {} as Record<string, string[]>,
      originalError: error
    };

    // Handle different types of errors
    if (error.response) {
      // Keep the original error message if available
      customError.message = error.response.data.message || 'Server error occurred';
      
      // Preserve field-specific errors if available
      if (error.response.data.errors && typeof error.response.data.errors === 'object') {
        customError.errors = error.response.data.errors;
      }
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          customError.message = 'Please sign in to continue';
          // Only redirect to login for authentication-related endpoints
          const authRelatedPaths = ['/auth/login', '/auth/register', '/auth/refresh'];
          const isAuthRelatedPath = authRelatedPaths.some(path => 
            error.config?.url?.includes(path)
          );
          
          if (isAuthRelatedPath || error.response.data.code === 'token_expired') {
            // Clear token on auth error
            localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
            
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          break;
        case 403:
          customError.message = 'You do not have permission to perform this action';
          break;
        case 404:
          customError.message = 'The requested resource was not found';
          break;
        case 409:
          customError.message = 'This action conflicts with existing data';
          break;
        case 422:
          customError.message = error.response.data.message || 'Validation failed. Please check your input.';
          break;
        case 429:
          customError.message = 'Too many requests. Please try again later';
          break;
        default:
          if (error.response.status >= 500) {
            customError.message = 'Server error occurred. Please try again later';
          }
      }
    } else if (error.request) {
      customError.message = 'Unable to connect to the server. Please check your internet connection';
    } else {
      customError.message = 'An error occurred while processing your request';
    }

    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: customError.status,
      message: customError.message,
      errors: customError.errors
    });

    return Promise.reject(customError);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
  }
};

export default api;