import axios from '../services/AxiosInstance'; // nếu bạn có axiosInstance
// Hoặc: import axios from 'axios';

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

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/login', data);
  return response.data;
};
