import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Accessing environment variable
  headers: {
    'Authorization': `Bearer ${token}`, // Get token from local storage or other source
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
