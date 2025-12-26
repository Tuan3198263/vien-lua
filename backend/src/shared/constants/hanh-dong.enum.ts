/**
 * Enum định nghĩa các hành động (actions) trong hệ thống
 * Đây là các quyền cố định, không thay đổi
 */
export enum HanhDong {
  /**
   * Xem danh sách
   */
  XEM = 'xem',

  /**
   * Xem chi tiết một bản ghi
   */
  XEM_CHI_TIET = 'xem_chi_tiet',

  /**
   * Thêm mới bản ghi
   */
  THEM = 'them',

  /**
   * Sửa/Cập nhật bản ghi
   */
  SUA = 'sua',

  /**
   * Xóa bản ghi
   */
  XOA = 'xoa',

  /**
   * Xuất file (Excel, PDF, etc.)
   */
  XUAT_FILE = 'xuat_file',
}

/**
 * Mảng tất cả các hành động
 * Sử dụng để validate và hiển thị danh sách
 */
export const TAT_CA_HANH_DONG = Object.values(HanhDong);

/**
 * Labels hiển thị cho từng hành động
 */
export const HANH_DONG_LABELS: Record<HanhDong, string> = {
  [HanhDong.XEM]: 'Xem danh sách',
  [HanhDong.XEM_CHI_TIET]: 'Xem chi tiết',
  [HanhDong.THEM]: 'Thêm mới',
  [HanhDong.SUA]: 'Sửa/Cập nhật',
  [HanhDong.XOA]: 'Xóa',
  [HanhDong.XUAT_FILE]: 'Xuất file',
};
