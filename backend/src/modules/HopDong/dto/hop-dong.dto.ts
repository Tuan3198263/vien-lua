import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

/**
 * DTO để tạo hợp đồng mới
 */
export class CreateHopDongDto {
  /**
   * Số hợp đồng - bắt buộc, unique
   */
  @IsNotEmpty({ message: 'Số hợp đồng không được để trống' })
  @IsString({ message: 'Số hợp đồng phải là chuỗi' })
  @MaxLength(50, { message: 'Số hợp đồng không được vượt quá 50 ký tự' })
  so_hop_dong: string;

  /**
   * Tên đối tác - bắt buộc
   */
  @IsNotEmpty({ message: 'Đối tác không được để trống' })
  @IsString({ message: 'Đối tác phải là chuỗi' })
  @MaxLength(100, { message: 'Đối tác không được vượt quá 100 ký tự' })
  doi_tac: string;

  /**
   * Ghi chú - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  @MaxLength(255, { message: 'Ghi chú không được vượt quá 255 ký tự' })
  ghi_chu?: string;
}

/**
 * DTO để cập nhật hợp đồng
 * Tất cả fields đều optional
 */
export class UpdateHopDongDto {
  /**
   * Số hợp đồng - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Số hợp đồng phải là chuỗi' })
  @MaxLength(50, { message: 'Số hợp đồng không được vượt quá 50 ký tự' })
  so_hop_dong?: string;

  /**
   * Tên đối tác - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Đối tác phải là chuỗi' })
  @MaxLength(100, { message: 'Đối tác không được vượt quá 100 ký tự' })
  doi_tac?: string;

  /**
   * Ghi chú - tùy chọn
   */
  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  @MaxLength(255, { message: 'Ghi chú không được vượt quá 255 ký tự' })
  ghi_chu?: string;
}
