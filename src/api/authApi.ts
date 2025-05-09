import axiosInstance, { publicRequest } from '../services/AxiosInstance';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

// API không cần token
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await publicRequest.post<LoginResponse>('/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<any> => {
  const response = await publicRequest.post<any>('/register', data);
  return response.data;
};

// API cần token
export const getUserProfile = async (): Promise<any> => {
  const response = await axiosInstance.get<any>('/user/profile');
  return response.data;
};

export const updateUserProfile = async (data: any): Promise<any> => {
  const response = await axiosInstance.put<any>('/user/profile', data);
  return response.data;
};

// Hàm kiểm tra token hiện tại có hợp lệ không
export const verifyToken = async (): Promise<boolean> => {
  try {
    await axiosInstance.get<any>('/auth/verify');
    return true;
  } catch (error) {
    return false;
  }
};