/**
 * Interface cho Authentication
 */

/**
 * DTO đăng nhập
 */
export interface LoginDto {
  tai_khoan: string;
  mat_khau: string;
}

/**
 * Response sau khi đăng nhập thành công
 */
export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    tai_khoan: string;
    email: string;
    ho_ten: string;
    vai_tro?: {
      id: number;
      ma_vai_tro: string;
      ten_vai_tro: string;
    };
  };
}

/**
 * Thông tin user đang đăng nhập (lưu trong Redux)
 */
export interface AuthUser {
  id: number;
  tai_khoan: string;
  email: string;
  ho_ten: string;
  vai_tro?: {
    id: number;
    ma_vai_tro: string;
    ten_vai_tro: string;
  };
  permissions?: string[]; // Danh sách quyền: ['NGUOI_DUNG:XEM', 'VAI_TRO:THEM', ...]
}

/**
 * State của auth trong Redux
 */
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
