import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://immihire-cms.vercel.app', // Strictly point to backend
  withCredentials: true, // Automatically send cookies with every request
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optional: Add interceptors for response handling (e.g. global 401 redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // You could dispatch an event or redirect to login
      console.warn('Unauthorized access - Please login.');
      // window.location.href = '/login'; // if needed
    }
    return Promise.reject(error);
  }
);

export default api;
