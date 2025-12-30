/**
 * Enum định nghĩa các hành động (actions) trong hệ thống
 * Logic đơn giản: 
 * - Mặc định: Xem (không cần bản ghi trong DB)
 * - THAO_TAC: Toàn quyền (bao gồm xem, thêm, sửa, xóa)
 */
export enum HanhDong {
  /**
   * Xem danh sách và chi tiết
   * Quyền mặc định, không cần bản ghi trong DB
   */
  XEM = 'xem',

  /**
   * Thao tác toàn quyền
   * Bao gồm: Xem, Thêm, Sửa, Xóa, Xuất file
   */
  THAO_TAC = 'thao_tac',
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
  [HanhDong.XEM]: 'Xem',
  [HanhDong.THAO_TAC]: 'Thao tác toàn quyền',
};
