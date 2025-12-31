import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * DTO cho upload file
 * Dùng khi upload file mới hoặc thay thế file cũ
 */
export class UploadFileDto {
  /**
   * Tên module (HOP_DONG, NHAN_VIEN...)
   */
  @IsString({ message: 'Module phải là chuỗi' })
  @IsNotEmpty({ message: 'Module không được để trống' })
  module: string;

  /**
   * ID bản ghi trong module
   */
  @IsInt({ message: 'ID bản ghi phải là số nguyên' })
  @IsNotEmpty({ message: 'ID bản ghi không được để trống' })
  ban_ghi_id: number;

  /**
   * Tên trường (file_hop_dong, anh_dai_dien...)
   */
  @IsString({ message: 'Tên trường phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên trường không được để trống' })
  ten_truong: string;
}

/**
 * DTO cho query lấy file
 * Dùng cho API GET file theo module/ban_ghi_id/ten_truong
 */
export class GetFileDto {
  /**
   * Tên module
   */
  @IsString({ message: 'Module phải là chuỗi' })
  @IsNotEmpty({ message: 'Module không được để trống' })
  module: string;

  /**
   * ID bản ghi trong module
   */
  @IsInt({ message: 'ID bản ghi phải là số nguyên' })
  @IsNotEmpty({ message: 'ID bản ghi không được để trống' })
  ban_ghi_id: number;

  /**
   * Tên trường
   */
  @IsString({ message: 'Tên trường phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên trường không được để trống' })
  ten_truong: string;
}

/**
 * DTO cho xóa file
 * Dùng cho API DELETE file
 */
export class DeleteFileDto {
  /**
   * Tên module
   */
  @IsString({ message: 'Module phải là chuỗi' })
  @IsNotEmpty({ message: 'Module không được để trống' })
  module: string;

  /**
   * ID bản ghi trong module
   */
  @IsInt({ message: 'ID bản ghi phải là số nguyên' })
  @IsNotEmpty({ message: 'ID bản ghi không được để trống' })
  ban_ghi_id: number;

  /**
   * Tên trường
   */
  @IsString({ message: 'Tên trường phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên trường không được để trống' })
  ten_truong: string;
}

/**
 * DTO cho xóa tất cả file của 1 bản ghi
 * Dùng khi xóa bản ghi trong module
 */
export class DeleteRecordFilesDto {
  /**
   * Tên module
   */
  @IsString({ message: 'Module phải là chuỗi' })
  @IsNotEmpty({ message: 'Module không được để trống' })
  module: string;

  /**
   * ID bản ghi trong module
   */
  @IsInt({ message: 'ID bản ghi phải là số nguyên' })
  @IsNotEmpty({ message: 'ID bản ghi không được để trống' })
  ban_ghi_id: number;
}

/**
 * Response khi upload/lấy file thành công
 */
export class FileResponseDto {
  id: number;
  ten_goc: string;
  ten_luu_tru: string;
  kich_thuoc: number;
  loai_file: string;
  module: string;
  ban_ghi_id: number;
  ten_truong: string;
  nguoi_cap_nhat: number;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  
  /**
   * URL tạm thời để xem/download file (presigned URL)
   */
  url_xem?: string;
}
