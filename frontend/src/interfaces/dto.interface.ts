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

/**
 * DTO Đề Tài
 * Dùng cho create/update đề tài
 */
export interface DeTaiDto {
  ten_de_tai: string;
  ma_de_tai?: string;
  don_vi_phe_duyet: string;
  cap_quan_ly_de_tai: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  phuong_thuc_khoang_chi?: string;
  noi_dung_khoang_chi?: string;
  linh_vuc_khoa_hoc?: string;
  nguon_goc_de_tai?: string;
  hop_dong?: string;
  bien_ban_thanh_ly?: string;
  chu_nhiem_de_tai: string;
  thu_ky_de_tai: string;
  thong_tin_doi_tac?: string;
  kinh_phi_tong: number;
}

/**
 * DTO Kinh Phí Năm
 * Dùng cho create/update kinh phí theo năm
 */
export interface KinhPhiNamDto {
  nam: number;
  kinh_phi: number;
}

/**
 * DTO Sản Phẩm Dự Kiến
 * Dùng cho create/update sản phẩm dự kiến
 */
export interface SanPhamDto {
  ten_san_pham: string;
}

/**
 * DTO Sản Phẩm Thực Tế
 * Dùng cho create/update sản phẩm thực tế
 */
export interface SanPhamThucTeDto {
  ten_san_pham: string;
}

/**
 * DTO Hồ Sơ Lưu Trữ
 * Dùng cho create/update hồ sơ lưu trữ
 */
export interface HoSoLuuTruDto {
  loai_ho_so: string;
  nam: number;
}

/**
 * DTO Đấu Thầu
 * Dùng cho create/update đấu thầu
 */
export interface DauThauDto {
  de_tai_id: number;
  nam_thuc_hien: number;
  nguon_kinh_phi?: string;
  tong_kinh_phi: number;
}

/**
 * DTO Danh Sách Đấu Thầu
 * Dùng cho create/update danh sách đấu thầu
 */
export interface DanhSachDauThauDto {
  nam: number;
  kinh_phi: number;
  hinh_thuc?: string;
  buoc?: string;
  trang_thai?: string;
}

/**
 * DTO Đề Cương Thí Nghiệm
 * Dùng cho create/update đề cương thí nghiệm
 */
export interface DeCuongThiNghiemDto {
  de_tai_id: number;
  ten_thi_nghiem: string;
  loai_hinh_thi_nghiem: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  mua_vu: string;
  nguoi_thuc_hien: string;
  kinh_phi_ky_thuat: number;
  kinh_phi_lao_dong: number;
  kinh_phi_nguyen_vat_lieu: number;
}

/**
 * DTO Danh Sách Số Lượng Thí Nghiệm
 * Dùng cho create/update danh sách số lượng thí nghiệm
 */
export interface DanhSachSoLuongThiNghiemDto {
  dia_diem: string;
  vi_tri: string;
  dien_tich: number;
}
