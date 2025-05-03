import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // hoặc dùng biến môi trường VITE_API_BASE_URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // nếu dùng cookie/session
});

export default axiosInstance;
