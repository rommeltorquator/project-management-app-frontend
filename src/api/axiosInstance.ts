import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Accessing environment variable
  headers: {
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

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      // Clear token and redirect to login
      // const navigate = useNavigate();
      Cookies.remove('token')
      // navigate('/');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
