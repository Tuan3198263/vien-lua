/**
 * Auth API Service
 */

import { 
  LoginDto, 
  LoginResponse, 
  AuthUser 
} from '@/interfaces';
import { API_URL } from '@/config/api.config';
import axiosInstance from '../axios';

/**
 * API services cho authentication
 * 
 * Note: Auth APIs trả về data trực tiếp, không wrap trong {data: ...}
 * nên không dùng coreApi mà gọi axios trực tiếp
 */
export const authApi = {
  /**
   * Đăng nhập
   */
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(`${API_URL.AUTH}/login`, data);
    return response.data;
  },

  /**
   * Đăng xuất
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(`${API_URL.AUTH}/logout`);
    return response.data;
  },

  /**
   * Lấy thông tin profile
   */
  getProfile: async (): Promise<AuthUser> => {
    const response = await axiosInstance.get<AuthUser>(`${API_URL.AUTH}/profile`);
    return response.data;
  },
};
