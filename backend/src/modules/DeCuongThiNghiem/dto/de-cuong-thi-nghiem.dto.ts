import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

// ============================================
// DTO CHO ĐỀ CƯƠNG THÍ NGHIỆM (CHÍNH)
// ============================================

/**
 * DTO để tạo đề cương thí nghiệm mới
 */
export class CreateDeCuongThiNghiemDto {
  /**
   * Đề tài liên quan - bắt buộc
   */
  @IsNotEmpty({ message: 'Đề tài không được để trống' })
  @IsNumber()
  de_tai_id: number;

  /**
   * Tên thí nghiệm - bắt buộc
   */
  @IsNotEmpty({ message: 'Tên thí nghiệm không được để trống' })
  @IsString()
  @MaxLength(255)
  ten_thi_nghiem: string;

  /**
   * Loại hình thí nghiệm - bắt buộc
   */
  @IsNotEmpty({ message: 'Loại hình thí nghiệm không được để trống' })
  @IsString()
  @MaxLength(255)
  loai_hinh_thi_nghiem: string;

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
   * Mùa vụ - bắt buộc
   */
  @IsNotEmpty({ message: 'Mùa vụ không được để trống' })
  @IsString()
  @MaxLength(255)
  mua_vu: string;

  /**
   * Người thực hiện - bắt buộc
   */
  @IsNotEmpty({ message: 'Người thực hiện không được để trống' })
  @IsString()
  @MaxLength(255)
  nguoi_thuc_hien: string;

  /**
   * Kinh phí kỹ thuật - bắt buộc
   */
  @IsNotEmpty({ message: 'Kinh phí kỹ thuật không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Kinh phí kỹ thuật phải lớn hơn hoặc bằng 0' })
  kinh_phi_ky_thuat: number;

  /**
   * Kinh phí lao động - bắt buộc
   */
  @IsNotEmpty({ message: 'Kinh phí lao động không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Kinh phí lao động phải lớn hơn hoặc bằng 0' })
  kinh_phi_lao_dong: number;

  /**
   * Kinh phí nguyên vật liệu - bắt buộc
   */
  @IsNotEmpty({ message: 'Kinh phí nguyên vật liệu không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Kinh phí nguyên vật liệu phải lớn hơn hoặc bằng 0' })
  kinh_phi_nguyen_vat_lieu: number;
}

/**
 * DTO để cập nhật đề cương thí nghiệm
 * Tất cả fields đều optional
 */
export class UpdateDeCuongThiNghiemDto {
  @IsOptional()
  @IsNumber()
  de_tai_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ten_thi_nghiem?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  loai_hinh_thi_nghiem?: string;

  @IsOptional()
  @IsDateString()
  ngay_bat_dau?: string;

  @IsOptional()
  @IsDateString()
  ngay_ket_thuc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  mua_vu?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nguoi_thuc_hien?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  kinh_phi_ky_thuat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  kinh_phi_lao_dong?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  kinh_phi_nguyen_vat_lieu?: number;
}

/**
 * DTO cho filter và phân trang đề cương thí nghiệm
 */
export class FilterDeCuongThiNghiemDto extends PaginationDto {
  /**
   * Filter theo tên thí nghiệm (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  ten_thi_nghiem?: string;

  /**
   * Filter theo loại hình thí nghiệm (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  loai_hinh_thi_nghiem?: string;

  /**
   * Filter theo tên đề tài (tìm kiếm gần đúng)
   * Lưu ý: field này từ relation DeTai
   */
  @IsOptional()
  @IsString()
  ten_de_tai?: string;

  /**
   * Filter theo cấp quản lý đề tài (tìm kiếm gần đúng)
   * Lưu ý: field này từ relation DeTai
   */
  @IsOptional()
  @IsString()
  cap_quan_ly_de_tai?: string;

  /**
   * Filter theo đơn vị phê duyệt (tìm kiếm gần đúng)
   * Lưu ý: field này từ relation DeTai
   */
  @IsOptional()
  @IsString()
  don_vi_phe_duyet?: string;
}

// ============================================
// DTO CHO DANH SÁCH SỐ LƯỢNG THÍ NGHIỆM (SUB-MODULE)
// ============================================

/**
 * DTO để tạo danh sách số lượng thí nghiệm mới
 */
export class CreateDanhSachSoLuongThiNghiemDto {
  /**
   * Địa điểm - bắt buộc
   */
  @IsNotEmpty({ message: 'Địa điểm không được để trống' })
  @IsString()
  @MaxLength(255)
  dia_diem: string;

  /**
   * Vị trí - bắt buộc
   */
  @IsNotEmpty({ message: 'Vị trí không được để trống' })
  @IsString()
  @MaxLength(255)
  vi_tri: string;

  /**
   * Diện tích - bắt buộc
   */
  @IsNotEmpty({ message: 'Diện tích không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Diện tích phải lớn hơn hoặc bằng 0' })
  dien_tich: number;
}

/**
 * DTO để cập nhật danh sách số lượng thí nghiệm
 * Tất cả fields đều optional
 */
export class UpdateDanhSachSoLuongThiNghiemDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  dia_diem?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  vi_tri?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dien_tich?: number;
}
