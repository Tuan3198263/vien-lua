import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

/**
 * DTO để tạo nhà lưới mới
 */
export class CreateNhaLuoiDto {
  /**
   * Tên nhà lưới - bắt buộc
   */
  @IsNotEmpty({ message: 'Tên nhà lưới không được để trống' })
  @IsString({ message: 'Tên nhà lưới phải là chuỗi' })
  @MaxLength(255, { message: 'Tên nhà lưới không được vượt quá 255 ký tự' })
  ten_nha_luoi: string;

  /**
   * Khu vực - bắt buộc
   */
  @IsNotEmpty({ message: 'Khu không được để trống' })
  @IsString({ message: 'Khu phải là chuỗi' })
  @MaxLength(255, { message: 'Khu không được vượt quá 255 ký tự' })
  khu: string;

  /**
   * Số bể - bắt buộc
   */
  @IsNotEmpty({ message: 'Số bể không được để trống' })
  @IsNumber({}, { message: 'Số bể phải là số' })
  @Min(0, { message: 'Số bể phải lớn hơn hoặc bằng 0' })
  so_be: number;

  /**
   * Diện tích (m2) - bắt buộc
   */
  @IsNotEmpty({ message: 'Diện tích không được để trống' })
  @IsNumber({}, { message: 'Diện tích phải là số' })
  @Min(0, { message: 'Diện tích phải lớn hơn hoặc bằng 0' })
  dien_tich: number;

  /**
   * Địa điểm - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Địa điểm phải là chuỗi' })
  @MaxLength(255, { message: 'Địa điểm không được vượt quá 255 ký tự' })
  dia_diem?: string;
}

/**
 * DTO để cập nhật nhà lưới
 * Tất cả fields đều optional
 */
export class UpdateNhaLuoiDto {
  /**
   * Tên nhà lưới - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Tên nhà lưới phải là chuỗi' })
  @MaxLength(255, { message: 'Tên nhà lưới không được vượt quá 255 ký tự' })
  ten_nha_luoi?: string;

  /**
   * Khu vực - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Khu phải là chuỗi' })
  @MaxLength(255, { message: 'Khu không được vượt quá 255 ký tự' })
  khu?: string;

  /**
   * Số bể - tùy chọn
   */
  @IsOptional()
  @IsNumber({}, { message: 'Số bể phải là số' })
  @Min(0, { message: 'Số bể phải lớn hơn hoặc bằng 0' })
  so_be?: number;

  /**
   * Diện tích (m2) - tùy chọn
   */
  @IsOptional()
  @IsNumber({}, { message: 'Diện tích phải là số' })
  @Min(0, { message: 'Diện tích phải lớn hơn hoặc bằng 0' })
  dien_tich?: number;

  /**
   * Địa điểm - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Địa điểm phải là chuỗi' })
  @MaxLength(255, { message: 'Địa điểm không được vượt quá 255 ký tự' })
  dia_diem?: string;
}

/**
 * DTO cho filter và phân trang nhà lưới
 * Kế thừa PaginationDto và thêm các field filter riêng
 */
export class FilterNhaLuoiDto extends PaginationDto {
  /**
   * Filter theo tên nhà lưới (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString({ message: 'Tên nhà lưới phải là chuỗi' })
  ten_nha_luoi?: string;

  /**
   * Filter theo khu (tìm kiếm gần đúng)
   */
  @IsOptional()
  @IsString({ message: 'Khu phải là chuỗi' })
  khu?: string;

  /**
   * Filter theo số bể (tìm chính xác)
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Số bể phải là số' })
  so_be?: number;

  /**
   * Filter theo diện tích (tìm chính xác)
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Diện tích phải là số' })
  dien_tich?: number;
}

// ============================================
// DTO CHO LẦN SỬ DỤNG (SUB-MODULE)
// ============================================

/**
 * DTO để tạo lần sử dụng mới
 */
export class CreateLanSuDungDto {
  /**
   * ID đề cương thí nghiệm - bắt buộc
   */
  @IsNotEmpty({ message: 'Đề cương thí nghiệm không được để trống' })
  @IsNumber({}, { message: 'Đề cương thí nghiệm phải là số' })
  de_cuong_thi_nghiem_id: number;

  /**
   * Dụng cụ sử dụng - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Dụng cụ phải là chuỗi' })
  @MaxLength(255, { message: 'Dụng cụ không được vượt quá 255 ký tự' })
  dung_cu?: string;

  /**
   * Số lượng - tùy chọn
   */
  @IsOptional()
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0' })
  so_luong?: number;

  /**
   * Ngày mượn - tùy chọn
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsDateString({}, { message: 'Ngày mượn phải có định dạng YYYY-MM-DD' })
  ngay_muon?: string;

  /**
   * Ngày trả - tùy chọn
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsDateString({}, { message: 'Ngày trả phải có định dạng YYYY-MM-DD' })
  ngay_tra?: string;

  /**
   * Khấu hao - tùy chọn
   */
  @IsOptional()
  @IsNumber({}, { message: 'Khấu hao phải là số' })
  @Min(0, { message: 'Khấu hao phải lớn hơn hoặc bằng 0' })
  khau_hao?: number;

  /**
   * Hiện trạng - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Hiện trạng phải là chuỗi' })
  @MaxLength(255, { message: 'Hiện trạng không được vượt quá 255 ký tự' })
  hien_trang?: string;
}

/**
 * DTO để cập nhật lần sử dụng
 * Tất cả fields đều optional
 */
export class UpdateLanSuDungDto {
  /**
   * ID đề cương thí nghiệm - tùy chọn
   */
  @IsOptional()
  @IsNumber({}, { message: 'Đề cương thí nghiệm phải là số' })
  de_cuong_thi_nghiem_id?: number;

  /**
   * Dụng cụ sử dụng - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Dụng cụ phải là chuỗi' })
  @MaxLength(255, { message: 'Dụng cụ không được vượt quá 255 ký tự' })
  dung_cu?: string;

  /**
   * Số lượng - tùy chọn
   */
  @IsOptional()
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0' })
  so_luong?: number;

  /**
   * Ngày mượn - tùy chọn
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsDateString({}, { message: 'Ngày mượn phải có định dạng YYYY-MM-DD' })
  ngay_muon?: string;

  /**
   * Ngày trả - tùy chọn
   * Format: YYYY-MM-DD
   */
  @IsOptional()
  @IsDateString({}, { message: 'Ngày trả phải có định dạng YYYY-MM-DD' })
  ngay_tra?: string;

  /**
   * Khấu hao - tùy chọn
   */
  @IsOptional()
  @IsNumber({}, { message: 'Khấu hao phải là số' })
  @Min(0, { message: 'Khấu hao phải lớn hơn hoặc bằng 0' })
  khau_hao?: number;

  /**
   * Hiện trạng - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Hiện trạng phải là chuỗi' })
  @MaxLength(255, { message: 'Hiện trạng không được vượt quá 255 ký tự' })
  hien_trang?: string;
}
