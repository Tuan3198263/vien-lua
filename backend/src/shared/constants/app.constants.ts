/**
 * Các hằng số chung cho ứng dụng
 */

/**
 * Giới hạn phân trang mặc định
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Độ dài của JWT token (giờ)
 */
export const JWT_EXPIRATION = '24h';
export const JWT_REFRESH_EXPIRATION = '7d';

/**
 * Số vòng lặp để hash password với bcrypt
 */
export const BCRYPT_SALT_ROUNDS = 10;

/**
 * Các giá trị enum cho giới tính
 */
export enum GioiTinh {
  NAM = 'Nam',
  NU = 'Nữ',
  KHAC = 'Khác',
}

/**
 * Thông báo lỗi chung
 */
export const ERROR_MESSAGES = {
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  UNAUTHORIZED: 'Chưa đăng nhập hoặc token không hợp lệ',
  FORBIDDEN: 'Không có quyền truy cập',
  BAD_REQUEST: 'Dữ liệu không hợp lệ',
  INTERNAL_ERROR: 'Lỗi hệ thống',
  DUPLICATE: 'Dữ liệu đã tồn tại',
};

/**
 * Thông báo thành công chung
 */
export const SUCCESS_MESSAGES = {
  CREATED: 'Tạo mới thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xóa thành công',
  LOGIN: 'Đăng nhập thành công',
  LOGOUT: 'Đăng xuất thành công',
  REGISTER: 'Đăng ký thành công',
};
