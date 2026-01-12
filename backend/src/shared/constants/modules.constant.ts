/**
 * Danh sách các module trong hệ thống
 * File cố định, không cần quản lý qua database
 * 
 * Để thêm module mới: thêm 1 object vào DANH_SACH_MODULE
 */

export interface ModuleInfo {
  ma_module: string;      // Mã module (dùng trong code và permission check)
  ten_module: string;     // Tên module (hiển thị trên frontend)
  thu_tu?: number;        // Thứ tự sắp xếp
}

/**
 * Danh sách module trong hệ thống
 * Mỗi module tương ứng với 1 nhóm chức năng
 */
export const DANH_SACH_MODULE: ModuleInfo[] = [
  {
    ma_module: 'VAI_TRO',
    ten_module: 'Vai trò',
    thu_tu: 1,
  },
  {
    ma_module: 'NGUOI_DUNG',
    ten_module: 'Người dùng',
    thu_tu: 2,
  },
  {
    ma_module: 'HOP_DONG',
    ten_module: 'Hợp đồng',
    thu_tu: 3,
  },
  {
    ma_module: 'DE_TAI',
    ten_module: 'Đề tài',
    thu_tu: 4,
  },
  {
    ma_module: 'DAU_THAU',
    ten_module: 'Đấu thầu',
    thu_tu: 5,
  },
  {
    ma_module: 'DE_CUONG_THI_NGHIEM',
    ten_module: 'Đề cương thí nghiệm',
    thu_tu: 6,
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
