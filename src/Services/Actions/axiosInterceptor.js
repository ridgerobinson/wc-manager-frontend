import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create();
updateAuthorizationHeader();

function updateAuthorizationHeader(token) {
  const accessToken = token || localStorage.getItem('accessToken');
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // 1. SUCCESS HANDLING
    // We check the method to avoid spamming toasts on background GET requests.
    const method = response.config.method?.toLowerCase();

    const showSuccessToast = response.config.showSuccessToast;
    
    if (method !== 'get' && !!showSuccessToast) {
      // Look for a specific message from your backend, or use a default
      const successMessage = response.data?.message || 'Operation successful!';
      toast.success(successMessage);
    }
    
    // Always return the response so the calling component gets the data
    return response; 
  },
  (error) => {
    // 2. ERROR HANDLING
    // Extract the error message provided by your backend, or fallback to the HTTP error
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred.';
      
    toast.error(errorMessage);
    
    // Always reject the promise so the calling component knows it failed
    return Promise.reject(error);
  }
);

export default axiosInstance;