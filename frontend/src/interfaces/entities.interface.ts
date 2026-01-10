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
  vai_tro?: VaiTro;       // Quan hệ đến vai trò
  vai_tro_id?: number;    // Khóa ngoại
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Phân Quyền
 * (một quyền ứng với 1 module + 1 hành động)
 */
export interface PhanQuyen {
  id?: number;
  vai_tro_id: number;
  ma_module: string;   // Ví dụ: VAI_TRO, NGUOI_DUNG
  hanh_dong: string;   // Ví dụ: xem, them, sua, xoa
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
  phanQuyen?: PhanQuyen[];   // Danh sách quyền
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity File Hệ Thống (lưu metadata file S3)
 */
export interface FileHeThong {
  id: number;
  ten_goc: string;
  ten_luu_tru: string;
  duong_dan_s3: string;
  kich_thuoc: number;
  loai_file: string;
  module: string;
  ban_ghi_id: number;
  ten_truong: string;
  nguoi_cap_nhat: number;
  nguoi_cap_nhat_info?: NguoiDung;  // relation người cập nhật
  ngay_tao: string;
  ngay_cap_nhat: string;
  url_xem?: string;     // presigned URL
}

/**
 * Entity Hợp Đồng
 */
export interface HopDong {
  id?: number;
  so_hop_dong: string;
  doi_tac: string;
  ghi_chu?: string;
  nguoi_cap_nhat_id?: number;
  nguoi_cap_nhat?: {
    id: number;
    ho_ten: string;
  };
  file_hop_dong?: {
    id: number;
    ten_goc: string;
    url_xem?: string;  // Chỉ có ở findAll, không có ở findOne
  };
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Thông tin module (dùng cho constants)
 */
export interface ModuleInfo {
  ma_module: string;
  ten_module: string;
  thu_tu?: number;
}

/**
 * Entity Đề Tài
 */
export interface DeTai {
  id?: number;
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
  nguoi_cap_nhat_id?: number;
  nguoi_cap_nhat?: {
    id: number;
    ho_ten: string;
  };
  kinh_phi_nam?: KinhPhiNam[];
  san_pham?: SanPham[];
  san_pham_thuc_te?: SanPhamThucTe[];
  ho_so_luu_tru?: HoSoLuuTru[];
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Kinh Phí Năm
 */
export interface KinhPhiNam {
  id?: number;
  de_tai_id: number;
  nam: number;
  kinh_phi: number;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Sản Phẩm Dự Kiến
 */
export interface SanPham {
  id?: number;
  de_tai_id: number;
  ten_san_pham: string;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Sản Phẩm Thực Tế
 */
export interface SanPhamThucTe {
  id?: number;
  de_tai_id: number;
  ten_san_pham: string;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Hồ Sơ Lưu Trữ
 */
export interface HoSoLuuTru {
  id?: number;
  de_tai_id: number;
  loai_ho_so: string;
  ten_file?: string;
  nam: number;
  file_ho_so?: {
    id: number;
    ten_goc: string;
    url_xem?: string;
  };
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Đấu Thầu
 */
export interface DauThau {
  id?: number;
  de_tai_id: number;
  nam_thuc_hien: number;
  nguon_kinh_phi?: string;
  tong_kinh_phi: number;
  nguoi_cap_nhat_id?: number;
  nguoi_cap_nhat?: {
    id: number;
    ho_ten: string;
  };
  de_tai?: {
    id: number;
    ten_de_tai: string;
    don_vi_phe_duyet: string;
    cap_quan_ly_de_tai: string;
    chu_nhiem_de_tai: string;
  };
  danh_sach_dau_thau?: DanhSachDauThau[];
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

/**
 * Entity Danh Sách Đấu Thầu
 */
export interface DanhSachDauThau {
  id?: number;
  dau_thau_id: number;
  nam: number;
  kinh_phi: number;
  hinh_thuc?: string;
  buoc?: string;
  trang_thai?: string;
  ten_file?: string;
  file_dau_thau?: {
    id: number;
    ten_goc: string;
    url_xem?: string;
  };
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}
