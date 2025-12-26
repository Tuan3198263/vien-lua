/**
 * Danh sách các module trong hệ thống
 * File cố định, không cần quản lý qua database
 * 
 * Để thêm module mới: thêm 1 object vào DANH_SACH_MODULE
 */

export interface ModuleInfo {
  ma_module: string;      // Mã module (dùng trong code và permission check)
  ten_module: string;     // Tên module (hiển thị trên frontend)
  mo_ta?: string;         // Mô tả module
  icon?: string;          // Icon cho UI
  thu_tu?: number;        // Thứ tự sắp xếp
}

/**
 * Danh sách module trong hệ thống
 * Mỗi module tương ứng với 1 nhóm chức năng
 */
export const DANH_SACH_MODULE: ModuleInfo[] = [
  {
    ma_module: 'VAI_TRO',
    ten_module: 'Quản lý vai trò',
    mo_ta: 'Module quản lý vai trò người dùng và phân quyền',
    icon: 'users',
    thu_tu: 1,
  },
  {
    ma_module: 'NGUOI_DUNG',
    ten_module: 'Quản lý người dùng',
    mo_ta: 'Module quản lý người dùng hệ thống',
    icon: 'user',
    thu_tu: 2,
  },
  {
    ma_module: 'SAN_PHAM',
    ten_module: 'Quản lý sản phẩm',
    mo_ta: 'Module quản lý sản phẩm và danh mục',
    icon: 'box',
    thu_tu: 3,
  },
  {
    ma_module: 'DON_HANG',
    ten_module: 'Quản lý đơn hàng',
    mo_ta: 'Module quản lý đơn hàng và thanh toán',
    icon: 'shopping-cart',
    thu_tu: 4,
  },
  {
    ma_module: 'BAO_CAO',
    ten_module: 'Báo cáo thống kê',
    mo_ta: 'Module báo cáo và thống kê dữ liệu',
    icon: 'chart',
    thu_tu: 5,
  },
];

/**
 * Lấy danh sách tất cả mã module
 */
export const MA_MODULE_LIST = DANH_SACH_MODULE.map(m => m.ma_module);

/**
 * Kiểm tra mã module có hợp lệ không
 */
export function kiemTraMaModule(maModule: string): boolean {
  return MA_MODULE_LIST.includes(maModule);
}

/**
 * Lấy thông tin module theo mã
 */
export function layThongTinModule(maModule: string): ModuleInfo | undefined {
  return DANH_SACH_MODULE.find(m => m.ma_module === maModule);
}
