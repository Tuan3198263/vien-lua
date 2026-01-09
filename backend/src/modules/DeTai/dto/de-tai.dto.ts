import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

// ============================================
// DTO CHO ĐỀ TÀI (CHÍNH)
// ============================================

/**
 * DTO để tạo đề tài mới
 */
export class CreateDeTaiDto {
  /**
   * Tên đề tài - bắt buộc
   */
  @IsNotEmpty({ message: 'Tên đề tài không được để trống' })
  @IsString({ message: 'Tên đề tài phải là chuỗi' })
  @MaxLength(255)
  ten_de_tai: string;

  /**
   * Mã đề tài - tùy chọn
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ma_de_tai?: string;

  /**
   * Đơn vị phê duyệt - bắt buộc
   */
  @IsNotEmpty({ message: 'Đơn vị phê duyệt không được để trống' })
  @IsString()
  @MaxLength(255)
  don_vi_phe_duyet: string;

  /**
   * Cấp quản lý đề tài - bắt buộc
   */
  @IsNotEmpty({ message: 'Cấp quản lý đề tài không được để trống' })
  @IsString()
  @MaxLength(255)
  cap_quan_ly_de_tai: string;

  /**
   * Ngày bắt đầu - bắt buộc
   */
  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  @IsDateString()
  ngay_bat_dau: string;

  /**
   * Ngày kết thúc - bắt buộc
   */
  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  @IsDateString()
  ngay_ket_thuc: string;

  /**
   * Phương thức khoáng chi - tùy chọn
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  phuong_thuc_khoang_chi?: string;

  /**
   * Nội dung khoáng chi - tùy chọn
   */
  @IsOptional()
  @IsString()
  noi_dung_khoang_chi?: string;

  /**
   * Lĩnh vực khoa học - tùy chọn
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  linh_vuc_khoa_hoc?: string;

  /**
   * Nguồn gốc đề tài - tùy chọn
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nguon_goc_de_tai?: string;

  /**
   * Hợp đồng - tùy chọn
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  hop_dong?: string;

  /**
   * ID file hợp đồng - tùy chọn
   */
  @IsOptional()
  @IsNumber()
  file_hop_dong_id?: number;

  /**
   * Biên bản thanh lý - tùy chọn
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bien_ban_thanh_ly?: string;

  /**
   * ID file biên bản - tùy chọn
   */
  @IsOptional()
  @IsNumber()
  file_bien_ban_id?: number;

  /**
   * Chủ nhiệm đề tài - bắt buộc
   */
  @IsNotEmpty({ message: 'Chủ nhiệm đề tài không được để trống' })
  @IsString()
  @MaxLength(255)
  chu_nhiem_de_tai: string;

  /**
   * Thư ký đề tài - bắt buộc
   */
  @IsNotEmpty({ message: 'Thư ký đề tài không được để trống' })
  @IsString()
  @MaxLength(255)
  thu_ky_de_tai: string;

  /**
   * Thông tin đối tác - tùy chọn
   */
  @IsOptional()
  @IsString()
  thong_tin_doi_tac?: string;

  /**
   * Kinh phí tổng - bắt buộc
   */
  @IsNotEmpty({ message: 'Kinh phí tổng không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Kinh phí tổng phải lớn hơn hoặc bằng 0' })
  kinh_phi_tong: number;
}

/**
 * DTO để cập nhật đề tài
 * Tất cả fields đều optional
 */
export class UpdateDeTaiDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ten_de_tai?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ma_de_tai?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  don_vi_phe_duyet?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  cap_quan_ly_de_tai?: string;

  @IsOptional()
  @IsDateString()
  ngay_bat_dau?: string;

  @IsOptional()
  @IsDateString()
  ngay_ket_thuc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  phuong_thuc_khoang_chi?: string;

  @IsOptional()
  @IsString()
  noi_dung_khoang_chi?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  linh_vuc_khoa_hoc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nguon_goc_de_tai?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  hop_dong?: string;

  @IsOptional()
  @IsNumber()
  file_hop_dong_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bien_ban_thanh_ly?: string;

  @IsOptional()
  @IsNumber()
  file_bien_ban_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  chu_nhiem_de_tai?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  thu_ky_de_tai?: string;

  @IsOptional()
  @IsString()
  thong_tin_doi_tac?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  kinh_phi_tong?: number;
}

/**
 * DTO cho filter và phân trang đề tài
 */
export class FilterDeTaiDto extends PaginationDto {
  /**
   * Filter theo tên đề tài (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  ten_de_tai?: string;

  /**
   * Filter theo mã đề tài (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  ma_de_tai?: string;

  /**
   * Filter theo đơn vị phê duyệt (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  don_vi_phe_duyet?: string;

  /**
   * Filter theo cấp quản lý (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  cap_quan_ly_de_tai?: string;

  /**
   * Filter theo chủ nhiệm đề tài (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  chu_nhiem_de_tai?: string;

  /**
   * Filter theo hiện trạng nghiệm thu (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  hien_trang_nghiem_thu?: string;

  /**
   * Filter ngày bắt đầu từ
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsDateString()
  ngay_bat_dau_tu?: string;

  /**
   * Filter ngày bắt đầu đến
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsDateString()
  ngay_bat_dau_den?: string;
}

// ============================================
// DTO CHO KINH PHÍ THEO NĂM
// ============================================

/**
 * DTO để tạo kinh phí theo năm
 */
export class CreateKinhPhiNamDto {
  /**
   * Năm - bắt buộc
   */
  @IsNotEmpty({ message: 'Năm không được để trống' })
  @IsNumber()
  @Min(1900, { message: 'Năm không hợp lệ' })
  nam: number;

  /**
   * Kinh phí - bắt buộc
   */
  @IsNotEmpty({ message: 'Kinh phí không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Kinh phí phải lớn hơn hoặc bằng 0' })
  kinh_phi: number;
}

/**
 * DTO để cập nhật kinh phí theo năm
 */
export class UpdateKinhPhiNamDto {
  @IsOptional()
  @IsNumber()
  @Min(1900)
  nam?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  kinh_phi?: number;
}

// ============================================
// DTO CHO SẢN PHẨM DỰ KIẾN
// ============================================

/**
 * DTO để tạo sản phẩm dự kiến
 */
export class CreateSanPhamDto {
  /**
   * Tên sản phẩm - bắt buộc
   */
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString()
  @MaxLength(255)
  ten_san_pham: string;
}

/**
 * DTO để cập nhật sản phẩm dự kiến
 */
export class UpdateSanPhamDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ten_san_pham?: string;
}

// ============================================
// DTO CHO SẢN PHẨM THỰC TẾ
// ============================================

/**
 * DTO để tạo sản phẩm thực tế
 */
export class CreateSanPhamThucTeDto {
  /**
   * Tên sản phẩm - bắt buộc
   */
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString()
  @MaxLength(255)
  ten_san_pham: string;
}

/**
 * DTO để cập nhật sản phẩm thực tế
 */
export class UpdateSanPhamThucTeDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ten_san_pham?: string;
}

// ============================================
// DTO CHO HỒ SƠ LƯU TRỮ
// ============================================

/**
 * DTO để tạo hồ sơ lưu trữ
 */
export class CreateHoSoLuuTruDto {
  /**
   * Loại hồ sơ - bắt buộc
   */
  @IsNotEmpty({ message: 'Loại hồ sơ không được để trống' })
  @IsString()
  @MaxLength(255)
  loai_ho_so: string;

  /**
   * Năm - bắt buộc
   */
  @IsNotEmpty({ message: 'Năm không được để trống' })
  @IsNumber()
  @Min(1900, { message: 'Năm không hợp lệ' })
  nam: number;
}

/**
 * DTO để cập nhật hồ sơ lưu trữ
 */
export class UpdateHoSoLuuTruDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  loai_ho_so?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  nam?: number;
}
