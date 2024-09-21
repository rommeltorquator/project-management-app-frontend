// import axios, { AxiosRequestConfig } from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000', // Adjust to your backend URL
// });

// api.interceptors.request.use(
//   (config: AxiosRequestConfig): AxiosRequestConfig => {
//     const token = localStorage.getItem('token');
//     if (token && config.headers) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;
