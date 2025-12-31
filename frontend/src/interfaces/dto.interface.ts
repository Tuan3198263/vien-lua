/**
 * Data Transfer Objects (DTOs)
 * Interface dùng để gửi data lên backend API (POST/PATCH)
 * Không chứa metadata (id, ngay_tao, ngay_cap_nhat) và relations
 */

/**
 * DTO Người Dùng
 * Dùng cho create/update người dùng
 */
export interface NguoiDungDto {
  tai_khoan: string;
  mat_khau?: string;      // Optional khi update
  email: string;
  ho_ten: string;
  vai_tro_id: number;     // Chỉ ID, không phải full object
  sdt?: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  dia_chi?: string;
  ghi_chu?: string;
}

/**
 * DTO Hợp Đồng
 * Dùng cho create/update hợp đồng
 */
export interface HopDongDto {
  so_hop_dong: string;
  doi_tac: string;
  ghi_chu?: string;
}

/**
 * DTO Vai Trò
 * Dùng cho create/update vai trò
 */
export interface VaiTroDto {
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta?: string;
  permissions?: QuyenModuleDto[];
}

/**
 * DTO cho phân quyền theo từng module
 */
export interface QuyenModuleDto {
  ma_module: string;
  hanh_dong: string[];    // Ví dụ: ['xem', 'them', 'xoa']
}
