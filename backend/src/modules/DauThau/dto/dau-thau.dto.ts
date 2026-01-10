import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

// ============================================
// DTO CHO ĐẤU THẦU (CHÍNH)
// ============================================

/**
 * DTO để tạo đấu thầu mới
 */
export class CreateDauThauDto {
  /**
   * Đề tài liên quan - bắt buộc
   */
  @IsNotEmpty({ message: 'Đề tài không được để trống' })
  @IsNumber()
  de_tai_id: number;

  /**
   * Năm thực hiện - bắt buộc
   */
  @IsNotEmpty({ message: 'Năm thực hiện không được để trống' })
  @IsNumber()
  @Min(1900, { message: 'Năm phải lớn hơn 1900' })
  nam_thuc_hien: number;

  /**
   * Nguồn kinh phí - bắt buộc
   */
  @IsNotEmpty({ message: 'Nguồn kinh phí không được để trống' })
  @IsString()
  @MaxLength(255)
  nguon_kinh_phi: string;

  /**
   * Tổng kinh phí - bắt buộc
   */
  @IsNotEmpty({ message: 'Tổng kinh phí không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Tổng kinh phí phải lớn hơn hoặc bằng 0' })
  tong_kinh_phi: number;
}

/**
 * DTO để cập nhật đấu thầu
 * Tất cả fields đều optional
 */
export class UpdateDauThauDto {
  @IsOptional()
  @IsNumber()
  @Min(1900)
  nam_thuc_hien?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nguon_kinh_phi?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tong_kinh_phi?: number;
}

/**
 * DTO cho filter và phân trang đấu thầu
 */
export class FilterDauThauDto extends PaginationDto {
  /**
   * Filter theo năm thực hiện
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nam_thuc_hien?: number;

  /**
   * Filter theo nguồn kinh phí (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString()
  nguon_kinh_phi?: string;

  /**
   * Filter theo tên đề tài (tìm kiếm gần đúng)
   * Lưu ý: field này từ relation DeTai
   */
  @IsOptional()
  @IsString()
  ten_de_tai?: string;
}

// ============================================
// DTO CHO DANH SÁCH ĐẤU THẦU (SUB-MODULE)
// ============================================

/**
 * DTO để tạo danh sách đấu thầu mới
 */
export class CreateDanhSachDauThauDto {
  /**
   * Năm - bắt buộc
   */
  @IsNotEmpty({ message: 'Năm không được để trống' })
  @IsNumber()
  @Min(1900, { message: 'Năm phải lớn hơn 1900' })
  nam: number;

  /**
   * Kinh phí - bắt buộc
   */
  @IsNotEmpty({ message: 'Kinh phí không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Kinh phí phải lớn hơn hoặc bằng 0' })
  kinh_phi: number;

  /**
   * Hình thức - bắt buộc
   */
  @IsNotEmpty({ message: 'Hình thức không được để trống' })
  @IsString()
  @MaxLength(255)
  hinh_thuc: string;

  /**
   * Bước - bắt buộc
   */
  @IsNotEmpty({ message: 'Bước không được để trống' })
  @IsString()
  @MaxLength(100)
  buoc: string;

  /**
   * Trạng thái - bắt buộc
   */
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsString()
  @MaxLength(100)
  trang_thai: string;
}

/**
 * DTO để cập nhật danh sách đấu thầu
 * Tất cả fields đều optional
 */
export class UpdateDanhSachDauThauDto {
  @IsOptional()
  @IsNumber()
  @Min(1900)
  nam?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  kinh_phi?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  hinh_thuc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  buoc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  trang_thai?: string;
}
