/**
 * Interface cho module Người Dùng
 */

/**
 * Giới tính
 */
export enum GioiTinh {
  NAM = 'Nam',
  NU = 'Nữ',
  KHAC = 'Khác',
}

/**
 * Entity Người Dùng
 */
export interface NguoiDung {
  id?: number;
  tai_khoan: string;
  mat_khau?: string;
  email: string;
  ho_ten: string;
  sdt?: string;
  ngay_sinh?: string;
  gioi_tinh?: GioiTinh;
  dia_chi?: string;
  ghi_chu?: string;
  vai_tro?: VaiTro;
  vai_tro_id?: number;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Vai Trò (kèm quyền)
 */
export interface VaiTro {
  id?: number;
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta?: string;
  phanQuyen?: PhanQuyen[]; // Relations từ backend
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Phân Quyền
 */
export interface PhanQuyen {
  id?: number;
  vai_tro_id: number;
  ma_module: string; // Mã module (VAI_TRO, NGUOI_DUNG...)
  hanh_dong: string; // Hành động (xem, thao_tac)
  ngay_tao?: string;
}

/**
 * Thông tin module từ constants
 */
export interface ModuleInfo {
  ma_module: string;
  ten_module: string;
  thu_tu?: number;
}

/**
 * DTO để tạo/sửa vai trò
 */
export interface VaiTroDto {
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta?: string;
  permissions?: QuyenModuleDto[];
}

/**
 * DTO cho quyền của 1 module
 */
export interface QuyenModuleDto {
  ma_module: string;
  hanh_dong: string[]; // Mảng các hành động (xem, thao_tac)
}
