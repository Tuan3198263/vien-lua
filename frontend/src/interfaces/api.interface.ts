/**
 * Interface cho API responses và requests
 */

/**
 * Response thành công từ API
 */
export interface ApiSuccessResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

/**
 * Response có phân trang từ API
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Metadata cho phân trang
 */
export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

/**
 * Tham số phân trang khi gọi API
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  [key: string]: any; // Cho phép các filter khác
}

/**
 * Response lỗi từ API
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  errors?: Record<string, string[]>; // Validation errors
}

/**
 * Config cho API request
 */
export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: any;
  data?: any;
  timeout?: number;
}
