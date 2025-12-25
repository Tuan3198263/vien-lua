import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  MinLength,
  IsInt,
} from 'class-validator';
import { GioiTinh } from '../../../shared/constants/app.constants';

/**
 * DTO để tạo người dùng mới
 */
export class CreateNguoiDungDto {
  /**
   * Tài khoản đăng nhập
   * Bắt buộc, 3-50 ký tự
   */
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsString({ message: 'Tài khoản phải là chuỗi' })
  @MinLength(3, { message: 'Tài khoản phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Tài khoản không được vượt quá 50 ký tự' })
  tai_khoan: string;

  /**
   * Mật khẩu
   * Bắt buộc, ít nhất 6 ký tự
   */
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  mat_khau: string;

  /**
   * Họ và tên
   * Bắt buộc, tối đa 100 ký tự
   */
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  @MaxLength(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
  ho_ten: string;

  /**
   * Email
   * Bắt buộc, phải đúng định dạng email
   */
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự' })
  email: string;

  /**
   * Số điện thoại
   * Tùy chọn, tối đa 20 ký tự
   */
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  sdt?: string;

  /**
   * Ngày sinh (định dạng ISO: YYYY-MM-DD)
   * Tùy chọn
   */
  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không đúng định dạng' })
  ngay_sinh?: string;

  /**
   * Giới tính (Nam, Nữ, Khác)
   * Tùy chọn
   */
  @IsOptional()
  @IsEnum(GioiTinh, { message: 'Giới tính không hợp lệ' })
  gioi_tinh?: GioiTinh;

  /**
   * Địa chỉ
   * Tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  dia_chi?: string;

  /**
   * Ghi chú
   * Tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  ghi_chu?: string;

  /**
   * ID vai trò
   * Bắt buộc
   */
  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsInt({ message: 'ID vai trò phải là số nguyên' })
  vai_tro_id: number;
}

/**
 * DTO để cập nhật người dùng
 * Tất cả các trường đều optional
 */
export class UpdateNguoiDungDto {
  /**
   * Họ và tên
   */
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  @MaxLength(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
  ho_ten?: string;

  /**
   * Email
   */
  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự' })
  email?: string;

  /**
   * Số điện thoại
   */
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  sdt?: string;

  /**
   * Ngày sinh
   */
  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không đúng định dạng' })
  ngay_sinh?: string;

  /**
   * Giới tính
   */
  @IsOptional()
  @IsEnum(GioiTinh, { message: 'Giới tính không hợp lệ' })
  gioi_tinh?: GioiTinh;

  /**
   * Địa chỉ
   */
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  dia_chi?: string;

  /**
   * Ghi chú
   */
  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  ghi_chu?: string;

  /**
   * ID vai trò
   */
  @IsOptional()
  @IsInt({ message: 'ID vai trò phải là số nguyên' })
  vai_tro_id?: number;
}

/**
 * DTO để đổi mật khẩu
 */
export class ChangePasswordDto {
  /**
   * Mật khẩu cũ
   */
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  @IsString({ message: 'Mật khẩu cũ phải là chuỗi' })
  mat_khau_cu: string;

  /**
   * Mật khẩu mới
   */
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  mat_khau_moi: string;
}
