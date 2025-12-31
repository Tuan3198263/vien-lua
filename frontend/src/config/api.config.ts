/**
 * Cấu hình API URLs
 */

// Base URL của backend API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Danh sách các API endpoints
 */
export const API_URL = {
  AUTH: '/auth',
  NGUOI_DUNG: '/nguoi-dung',
  VAI_TRO: '/vai-tro',
  PHAN_QUYEN: '/phan-quyen',
  MODULE_HE_THONG: '/module-he-thong',
  FILE_HE_THONG: '/file-he-thong',
  HOP_DONG: '/hop-dong',
} as const;

/**
 * Timeout mặc định cho API requests (ms)
 */
export const API_TIMEOUT = 30000;

/**
 * Số lần retry khi request failed
 */
export const API_RETRY_COUNT = 2;
