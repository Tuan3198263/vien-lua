/**
 * Constants cho hành động (actions) trong hệ thống phân quyền
 * Version 2.0: Đơn giản hóa từ 6+ hành động xuống còn 2
 */

export enum HanhDong {
  /**
   * Xem: Quyền mặc định, không cần bản ghi trong DB
   * Cho phép: Xem danh sách, xem chi tiết
   */
  XEM = 'xem',

  /**
   * Thao tác: Toàn quyền, cần bản ghi trong DB
   * Cho phép: Tất cả (xem, thêm, sửa, xóa, xuất file...)
   */
  THAO_TAC = 'thao_tac',
}

/**
 * Labels cho hành động
 */
export const HANH_DONG_LABELS: Record<HanhDong, string> = {
  [HanhDong.XEM]: 'Xem',
  [HanhDong.THAO_TAC]: 'Thao tác (Toàn quyền)',
};

/**
 * Danh sách tất cả hành động
 */
export const ALL_HANH_DONG = Object.values(HanhDong);

/**
 * Helper function để tạo permission string
 * Format: MODULE:HANH_DONG
 * Ví dụ: NGUOI_DUNG:xem, VAI_TRO:thao_tac
 */
export const taoPermission = (module: string, hanhDong: HanhDong): string => {
  return `${module}:${hanhDong}`;
};

/**
 * Helper function để kiểm tra permission THAO_TAC
 * User có THAO_TAC = có toàn quyền
 */
export const kiemTraThaoTac = (
  userPermissions: string[] | undefined,
  module: string,
): boolean => {
  if (!userPermissions) return false;
  return userPermissions.includes(taoPermission(module, HanhDong.THAO_TAC));
};
