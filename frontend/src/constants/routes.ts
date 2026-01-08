/**
 * Định nghĩa các đường dẫn routes của hệ thống
 */

/**
 * Đường dẫn routes
 */
export const ROUTES = {
  // Auth routes
  DANG_NHAP: '/dang-nhap',
  KHONG_CO_QUYEN: '/khong-co-quyen',

  // Main routes
  TRANG_CHU: '/',
  NGUOI_DUNG: '/nguoi-dung',
  VAI_TRO: '/vai-tro',
  HOP_DONG: '/hop-dong',
  DE_TAI: '/de-tai',
  TAI_LIEU: '/tai-lieu',
} as const;

/**
 * Nhãn hiển thị cho routes
 */
export const ROUTE_LABELS = {
  TRANG_CHU: 'Trang chủ',
  PHAN_QUYEN: 'Phân quyền',
  NGUOI_DUNG: 'Người dùng',
  VAI_TRO: 'Vai trò',
  HOP_DONG: 'Hợp đồng',
  DE_TAI: 'Đề tài',
  TAI_LIEU: 'Tài liệu',
  DANG_NHAP: 'Đăng nhập',
  KHONG_CO_QUYEN: 'Không có quyền truy cập',
} as const;
