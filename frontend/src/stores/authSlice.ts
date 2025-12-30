/**
 * Auth Slice - Quản lý state authentication
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser, LoginResponse } from '@/interfaces';
import { STORAGE_KEYS } from '@/config/app.config';

/**
 * Lấy token từ localStorage khi khởi động
 */
const getInitialToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
};

/**
 * Lấy thông tin user từ localStorage khi khởi động
 */
const getInitialUser = (): AuthUser | null => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * Initial state
 */
const initialState: AuthState = {
  user: getInitialUser(),
  accessToken: getInitialToken(),
  refreshToken: null,
  isAuthenticated: !!getInitialToken(),
  isLoading: false,
};

/**
 * Auth slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Đăng nhập thành công
     */
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      const { access_token, refresh_token, user } = action.payload;

      state.user = user;
      state.accessToken = access_token;
      state.refreshToken = refresh_token || null;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Lưu vào localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      if (refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      }
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
    },

    /**
     * Đăng xuất
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Xóa localStorage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    },

    /**
     * Cập nhật thông tin user
     */
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(state.user));
      }
    },

    /**
     * Cập nhật token mới (sau khi refresh token)
     */
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, action.payload);
    },

    /**
     * Cập nhật danh sách quyền
     */
    updatePermissions: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.permissions = action.payload;
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(state.user));
      }
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  logout,
  updateUser,
  updateToken,
  updatePermissions,
} = authSlice.actions;

export default authSlice.reducer;
