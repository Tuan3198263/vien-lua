/**
 * Interface cho module Người Dùng
 */

/**
 * Entity Người Dùng
 */
export interface NguoiDung {
  id: number;
  tai_khoan: string;
  email: string;
  ho_ten: string;
  so_dien_thoai?: string;
  trang_thai: boolean;
  id_vai_tro?: number;
  vai_tro?: VaiTro;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

/**
 * DTO tạo mới người dùng
 */
export interface CreateNguoiDungDto {
  tai_khoan: string;
  mat_khau: string;
  email: string;
  ho_ten: string;
  so_dien_thoai?: string;
  id_vai_tro?: number;
}

/**
 * DTO cập nhật người dùng
 */
export interface UpdateNguoiDungDto {
  email?: string;
  ho_ten?: string;
  so_dien_thoai?: string;
  trang_thai?: boolean;
  id_vai_tro?: number;
}

/**
 * Entity Vai Trò
 */
export interface VaiTro {
  id: number;
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta?: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

/**
 * DTO tạo mới vai trò
 */
export interface CreateVaiTroDto {
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta?: string;
}

/**
 * DTO cập nhật vai trò
 */
export interface UpdateVaiTroDto {
  ten_vai_tro?: string;
  mo_ta?: string;
}

/**
 * Entity Phân Quyền
 */
export interface PhanQuyen {
  id: number;
  id_vai_tro: number;
  id_module_he_thong: number;
  hanh_dong: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  vai_tro?: VaiTro;
  module_he_thong?: ModuleHeThong;
}

/**
 * Entity Module Hệ Thống
 */
export interface ModuleHeThong {
  id: number;
  ma_module: string;
  ten_module: string;
  mo_ta?: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

/**
 * DTO gán quyền cho vai trò
 */
export interface GanQuyenDto {
  id_vai_tro: number;
  id_module_he_thong: number;
  hanh_dong: string[];
}
