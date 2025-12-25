import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO cho đăng ký tài khoản
 */
export class RegisterDto {
  /**
   * Tài khoản đăng nhập
   */
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsString({ message: 'Tài khoản phải là chuỗi' })
  tai_khoan: string;

  /**
   * Mật khẩu
   */
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  mat_khau: string;

  /**
   * Họ và tên
   */
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  ho_ten: string;

  /**
   * Email
   */
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString({ message: 'Email phải là chuỗi' })
  email: string;
}

/**
 * DTO cho đăng nhập
 */
export class LoginDto {
  /**
   * Tài khoản đăng nhập
   */
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsString({ message: 'Tài khoản phải là chuỗi' })
  tai_khoan: string;

  /**
   * Mật khẩu
   */
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  mat_khau: string;
}

/**
 * Response sau khi đăng nhập thành công
 */
export interface AuthResponse {
  /**
   * JWT access token
   */
  access_token: string;

  /**
   * Thông tin người dùng
   */
  user: {
    id: number;
    tai_khoan: string;
    ho_ten: string;
    email: string;
    vai_tro: any;
  };
}

/**
 * Response sau khi đăng ký thành công
 */
export interface RegisterResponse {
  /**
   * Thông báo đăng ký thành công
   */
  message: string;

  /**
   * Thông tin người dùng
   */
  user: {
    id: number;
    tai_khoan: string;
    ho_ten: string;
    email: string;
    vai_tro: any;
  };
}
