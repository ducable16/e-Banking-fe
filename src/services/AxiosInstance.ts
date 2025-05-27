import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Lấy base URL từ biến môi trường hoặc sử dụng giá trị mặc định
const BASE_URL = 'http://localhost:8080/';

// Tạo instance của axios với base URL
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // timeout kết nối (ms)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header cho mỗi request nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    // Nếu request không yêu cầu token, bỏ qua
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
      return config;
    }
    
    // Thêm token vào header nếu có
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  // ✅ Trường hợp HTTP status 2xx
  (response) => {
    const res = response.data;

    // Luôn kiểm tra theo field của body, bỏ qua HTTP status
    if (res && res.success === false) {
      return Promise.reject({
        message: res.message || 'Lỗi không xác định',
        errorCode: res.errorCode || 'UNKNOWN_ERROR',
        status: res.status || 400,
        data: res.data || null,
      });
    }

    return res; // Trả ra data nếu thành công
  },

  // ✅ Trường hợp HTTP status khác 2xx nhưng vẫn có body
  (error) => {
    const res = error.response;

    if (res?.data && typeof res.data === 'object') {
      const body = res.data;
      // Kiểm tra lỗi hết phiên đăng nhập
      if (body.errorCode === 'UNAUTHORIZED') {
        localStorage.removeItem('token');
        alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
        window.location.href = '/login';
      }
      return Promise.reject({
        message: body.message || 'Lỗi không xác định',
        errorCode: body.errorCode || 'UNKNOWN_ERROR',
        status: body.status || res.status || 400,
        data: body.data || null,
      });
    }

    // Trường hợp không có phản hồi (network error, timeout, CORS...)
    return Promise.reject({
      message: 'Lỗi kết nối tới máy chủ',
      errorCode: 'NETWORK_ERROR',
      status: null,
      data: null,
    });
  }
);


// Hàm helper để gọi API không cần token
export const publicRequest = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<T>(url, { 
      ...config, 
      headers: { ...config?.headers, skipAuth: true } 
    }),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.post<T>(url, data, { 
      ...config, 
      headers: { ...config?.headers, skipAuth: true } 
    }),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.put<T>(url, data, { 
      ...config, 
      headers: { ...config?.headers, skipAuth: true } 
    }),
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.delete<T>(url, { 
      ...config, 
      headers: { ...config?.headers, skipAuth: true } 
    }),
};

export default axiosInstance;