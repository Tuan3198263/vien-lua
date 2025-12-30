/**
 * Constants cho hành động (actions) trong hệ thống phân quyền
 */

export enum HanhDong {
  XEM = 'XEM',
  XEM_CHI_TIET = 'XEM_CHI_TIET',
  THEM = 'THEM',
  SUA = 'SUA',
  XOA = 'XOA',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

/**
 * Labels cho hành động
 */
export const HANH_DONG_LABELS: Record<HanhDong, string> = {
  [HanhDong.XEM]: 'Xem',
  [HanhDong.XEM_CHI_TIET]: 'Xem chi tiết',
  [HanhDong.THEM]: 'Thêm',
  [HanhDong.SUA]: 'Sửa',
  [HanhDong.XOA]: 'Xóa',
  [HanhDong.EXPORT]: 'Xuất file',
  [HanhDong.IMPORT]: 'Nhập file',
};

/**
 * Danh sách tất cả hành động
 */
export const ALL_HANH_DONG = Object.values(HanhDong);
