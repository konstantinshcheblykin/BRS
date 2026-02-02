import axios from 'axios';

// Get API URL from environment or use default
// In Docker, frontend runs on port 3000, backend on 8000
// Both are accessible via localhost from browser
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Adaptive timeout based on request type
const getTimeout = (config) => {
  if (config.method === 'get') return 30000; // 30s for GET requests
  if (config.method === 'post' || config.method === 'put') return 20000; // 20s for POST/PUT
  return 15000; // 15s for DELETE
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // Default 30 seconds timeout (will be overridden by interceptor)
});

// Request interceptor to set adaptive timeout
apiClient.interceptors.request.use((config) => {
  // Set adaptive timeout based on request type
  if (!config.timeout) {
    config.timeout = getTimeout(config);
  }
  return config;
});

// Response interceptor with retry mechanism
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Retry logic for network errors, timeouts, or 5xx server errors
    const isRetryableError = 
      !error.response || // Network error (no response)
      error.code === 'ECONNABORTED' || // Timeout
      error.message?.includes('timeout') || // Timeout message
      (error.response.status >= 500 && error.response.status < 600); // 5xx server errors
    
    if (
      isRetryableError &&
      (!config || !config.__retryCount || config.__retryCount < MAX_RETRIES)
    ) {
      config.__retryCount = config.__retryCount || 0;
      config.__retryCount += 1;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = RETRY_DELAY * Math.pow(2, config.__retryCount - 1);
      
      console.log(`Retrying request (attempt ${config.__retryCount}/${MAX_RETRIES}) after ${delay}ms...`);
      
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      return apiClient(config);
    }
    
    // Log error for debugging
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      request: error.request,
      retryCount: config?.__retryCount || 0,
    });

    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const status = error.response.status;
      const data = error.response.data;
      
      let errorMessage = 'An error occurred';
      
      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.errors) {
        // Validation errors
        const errors = Object.values(data.errors).flat();
        errorMessage = errors.join(', ');
      } else if (status === 404) {
        errorMessage = 'Resource not found';
      } else if (status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (status === 0 || status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.response = error.response;
      enhancedError.status = status;
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Request was made but no response received
      // This usually means backend is not running or network issue
      const enhancedError = new Error(
        'Cannot connect to server. Please check if the backend is running on ' + API_URL
      );
      enhancedError.request = error.request;
      enhancedError.isNetworkError = true;
      return Promise.reject(enhancedError);
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export const notesApi = {
  getAll: () => apiClient.get('/notes'),
  getById: (id) => apiClient.get(`/notes/${id}`),
  create: (data) => apiClient.post('/notes', data),
  update: (id, data) => apiClient.put(`/notes/${id}`, data),
  delete: (id) => apiClient.delete(`/notes/${id}`),
};

export default apiClient;
