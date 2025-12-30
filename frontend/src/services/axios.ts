/**
 * Axios instance với interceptors
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/config/api.config';
import { STORAGE_KEYS } from '@/config/app.config';
import { ApiErrorResponse } from '@/interfaces';
import { ERROR_MESSAGES } from '@/constants';

/**
 * Tạo axios instance
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Tự động thêm token vào header
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    // Nếu có token, thêm vào header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Xử lý response và errors
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    console.error('[API Response Error]', error);

    // Không có response (network error, timeout...)
    if (!error.response) {
      const errorMessage = error.code === 'ECONNABORTED' 
        ? ERROR_MESSAGES.TIMEOUT 
        : ERROR_MESSAGES.NETWORK;
      
      return Promise.reject({
        message: errorMessage,
        statusCode: 0,
      });
    }

    const { status, data } = error.response;

    // 401 Unauthorized - Token hết hạn hoặc không hợp lệ
    if (status === 401) {
      console.log('Token hết hạn hoặc không hợp lệ, đăng xuất...');
      
      // Clear token
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);

      // Redirect về trang đăng nhập
      window.location.href = '/dang-nhap';

      return Promise.reject({
        message: ERROR_MESSAGES.TOKEN_EXPIRED,
        statusCode: 401,
      });
    }

    // 403 Forbidden - Không có quyền
    if (status === 403) {
      return Promise.reject({
        message: data?.message || ERROR_MESSAGES.FORBIDDEN,
        statusCode: 403,
      });
    }

    // 404 Not Found
    if (status === 404) {
      return Promise.reject({
        message: data?.message || 'Không tìm thấy tài nguyên',
        statusCode: 404,
      });
    }

    // 500 Server Error
    if (status >= 500) {
      return Promise.reject({
        message: ERROR_MESSAGES.SERVER,
        statusCode: status,
      });
    }

    // Các lỗi khác
    return Promise.reject({
      message: data?.message || ERROR_MESSAGES.UNKNOWN,
      statusCode: status,
      errors: data?.errors,
    });
  }
);

export default axiosInstance;
