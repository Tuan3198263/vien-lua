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
 * Entity Vai Trò
 */
export interface VaiTro {
  id?: number;
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta?: string;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Phân Quyền
 */
export interface PhanQuyen {
  id?: number;
  vai_tro_id: number;
  module_he_thong_id: number;
  hanh_dong: string;
  vai_tro?: VaiTro;
  module_he_thong?: ModuleHeThong;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Module Hệ Thống
 */
export interface ModuleHeThong {
  id?: number;
  ma_module: string;
  ten_module: string;
  mo_ta?: string;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}
