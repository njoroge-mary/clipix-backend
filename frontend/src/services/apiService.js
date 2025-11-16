import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('API No Response:', error.request);
    } else {
      // Error in request configuration
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Health check
  getHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Failed to check health status');
    }
  },

  // Get API root info
  getRoot: async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch API info');
    }
  },

  // Create status check
  createStatusCheck: async (clientName) => {
    try {
      const response = await apiClient.post('/status', { client_name: clientName });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create status check');
    }
  },

  // Get all status checks
  getStatusChecks: async () => {
    try {
      const response = await apiClient.get('/status');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch status checks');
    }
  },
};

export default apiService;
