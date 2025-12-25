import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

/**
 * DTO để tạo vai trò mới
 */
export class CreateVaiTroDto {
  /**
   * Mã vai trò (ADMIN, USER, MANAGER...)
   * Bắt buộc, tối đa 50 ký tự
   */
  @IsNotEmpty({ message: 'Mã vai trò không được để trống' })
  @IsString({ message: 'Mã vai trò phải là chuỗi' })
  @MaxLength(50, { message: 'Mã vai trò không được vượt quá 50 ký tự' })
  ma_vai_tro: string;

  /**
   * Tên vai trò hiển thị
   * Bắt buộc, tối đa 100 ký tự
   */
  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  @IsString({ message: 'Tên vai trò phải là chuỗi' })
  @MaxLength(100, { message: 'Tên vai trò không được vượt quá 100 ký tự' })
  ten_vai_tro: string;

  /**
   * Mô tả vai trò
   * Tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  mo_ta?: string;
}

/**
 * DTO để cập nhật vai trò
 * Tất cả các trường đều optional
 */
export class UpdateVaiTroDto {
  /**
   * Mã vai trò (ADMIN, USER, MANAGER...)
   * Tùy chọn, tối đa 50 ký tự
   */
  @IsOptional()
  @IsString({ message: 'Mã vai trò phải là chuỗi' })
  @MaxLength(50, { message: 'Mã vai trò không được vượt quá 50 ký tự' })
  ma_vai_tro?: string;

  /**
   * Tên vai trò hiển thị
   * Tùy chọn, tối đa 100 ký tự
   */
  @IsOptional()
  @IsString({ message: 'Tên vai trò phải là chuỗi' })
  @MaxLength(100, { message: 'Tên vai trò không được vượt quá 100 ký tự' })
  ten_vai_tro?: string;

  /**
   * Mô tả vai trò
   * Tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  mo_ta?: string;
}
