/**
 * Constants cho các thông báo trong hệ thống
 */

/**
 * Thông báo thành công
 */
export const SUCCESS_MESSAGES = {
  CREATE: 'Thêm thành công',
  UPDATE: 'Cập nhật thành công',
  DELETE: 'Xóa thành công',
  SAVE: 'Lưu thành công',
  LOGIN: 'Đăng nhập thành công',
  LOGOUT: 'Đăng xuất thành công',
} as const;

/**
 * Thông báo lỗi
 */
export const ERROR_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc',
  UNKNOWN: 'Đã xảy ra lỗi không xác định',
  NETWORK: 'Lỗi kết nối mạng',
  SERVER: 'Lỗi máy chủ',
  TIMEOUT: 'Yêu cầu hết thời gian chờ',
  CREATE_FAILED: 'Thêm thất bại',
  UPDATE_FAILED: 'Cập nhật thất bại',
  DELETE_FAILED: 'Xóa thất bại',
  FETCH_FAILED: 'Lấy dữ liệu thất bại',
  UNAUTHORIZED: 'Bạn chưa đăng nhập',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
  // Validation errors - đồng bộ với backend entity validation
  MAX_LENGTH_255: 'Trường này tối đa 255 ký tự',
  MAX_LENGTH_100: 'Trường này tối đa 100 ký tự',
  MAX_LENGTH_50: 'Trường này tối đa 50 ký tự',
  MAX_VALUE: 'Giá trị không vượt quá', // Sử dụng: `${ERROR_MESSAGES.MAX_VALUE} ${max}`
  MIN_VALUE_ZERO: 'Giá trị phải lớn hơn hoặc bằng 0',
  NEGATIVE_NOT_ALLOWED: 'Giá trị không được âm',
  INVALID_NUMBER: 'Giá trị phải là số',
} as const;

/**
 * Thông báo xác nhận
 */
export const CONFIRM_MESSAGES = {
  DELETE: 'Bạn có chắc chắn muốn xóa?',
  LOGOUT: 'Bạn có chắc chắn muốn đăng xuất?',
  CANCEL: 'Bạn có chắc chắn muốn hủy? Dữ liệu chưa lưu sẽ bị mất.',
} as const;

/**
 * Placeholder cho input
 */
export const PLACEHOLDERS = {
  SEARCH: 'Tìm kiếm...',
  SELECT: 'Chọn...',
  INPUT: 'Nhập...',
} as const;

/**
 * Labels cho form
 */
export const LABELS = {
  ACTIONS: 'Thao tác',
  SEARCH: 'Tìm kiếm',
  FILTER: 'Lọc',
  RESET: 'Đặt lại',
  SUBMIT: 'Xác nhận',
  CANCEL: 'Hủy',
  SAVE: 'Lưu',
  EDIT: 'Sửa',
  DELETE: 'Xóa',
  CREATE: 'Tạo mới',
  DETAIL: 'Chi tiết',
  BACK: 'Quay lại',
} as const;

/**
 * Tổng hợp tất cả messages
 */
export const MESSAGES = {
  SUCCESS: SUCCESS_MESSAGES,
  ERROR: ERROR_MESSAGES,
  CONFIRM: CONFIRM_MESSAGES,
  PLACEHOLDER: PLACEHOLDERS,
  LABEL: LABELS,
} as const;
