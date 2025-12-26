import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HanhDong } from '../../../shared/constants/hanh-dong.enum';

/**
 * DTO cho phân quyền một module
 * Dùng khi tạo/sửa vai trò
 */
export class QuyenModuleDto {
  /**
   * Mã module (VAI_TRO, NGUOI_DUNG...)
   */
  @IsNotEmpty({ message: 'Mã module không được để trống' })
  @IsString({ message: 'Mã module phải là chuỗi' })
  ma_module: string;

  /**
   * Danh sách hành động được phép
   * Mảng các giá trị của enum HanhDong
   */
  @IsArray({ message: 'Danh sách hành động phải là mảng' })
  @IsString({ each: true, message: 'Mỗi hành động phải là chuỗi' })
  hanh_dong: HanhDong[];
}

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

  /**
   * Danh sách quyền của vai trò
   * Mỗi phần tử chứa ma_module và danh sách hanh_dong
   */
  @IsOptional()
  @IsArray({ message: 'Danh sách quyền phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => QuyenModuleDto)
  permissions?: QuyenModuleDto[];
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

  /**
   * Danh sách quyền của vai trò
   * Mỗi phần tử chứa ma_module và danh sách hanh_dong
   * Tùy chọn - nếu có thì sẽ cập nhật quyền
   */
  @IsOptional()
  @IsArray({ message: 'Danh sách quyền phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => QuyenModuleDto)
  permissions?: QuyenModuleDto[];
}
