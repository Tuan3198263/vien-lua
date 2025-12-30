/**
 * Auth API Service
 */

import { 
  LoginDto, 
  LoginResponse, 
  RegisterDto, 
  RegisterResponse,
  AuthUser 
} from '@/interfaces';
import { API_URL } from '@/config/api.config';
import { getData, postData } from './coreApi';

/**
 * API services cho authentication
 */
export const authApi = {
  /**
   * Đăng nhập
   */
  login: (data: LoginDto) => 
    postData<LoginResponse>(`${API_URL.AUTH}/login`, data),

  /**
   * Đăng ký tài khoản
   */
  register: (data: RegisterDto) => 
    postData<RegisterResponse>(`${API_URL.AUTH}/register`, data),

  /**
   * Đăng xuất
   */
  logout: () => 
    postData(`${API_URL.AUTH}/logout`),

  /**
   * Lấy thông tin profile
   */
  getProfile: () => 
    getData<AuthUser>(`${API_URL.AUTH}/profile`),

  /**
   * Đổi mật khẩu
   */
  changePassword: (data: { mat_khau_cu: string; mat_khau_moi: string }) => 
    postData(`${API_URL.AUTH}/change-password`, data),

  /**
   * Refresh token
   */
  refreshToken: (refreshToken: string) => 
    postData<{ access_token: string }>(`${API_URL.AUTH}/refresh-token`, { refresh_token: refreshToken }),
};
