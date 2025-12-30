/**
 * Cấu hình constants cho ứng dụng
 */

/**
 * Keys cho localStorage
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  LANGUAGE: 'language',
} as const;

/**
 * Cấu hình phân trang mặc định
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
} as const;

/**
 * Cấu hình table
 */
export const TABLE_CONFIG = {
  SCROLL_X: 1200,
  ROW_KEY: 'id',
} as const;

/**
 * Cấu hình form
 */
export const FORM_CONFIG = {
  LAYOUT: 'vertical' as const,
  LABEL_COL: { span: 24 },
  WRAPPER_COL: { span: 24 },
} as const;

/**
 * Debounce time (ms)
 */
export const DEBOUNCE_TIME = 500;

/**
 * Date format
 */
export const DATE_FORMAT = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_TIME: 'DD/MM/YYYY HH:mm:ss',
  API: 'YYYY-MM-DD',
  API_TIME: 'YYYY-MM-DD HH:mm:ss',
} as const;
