import { IsInt, IsNotEmpty, IsEnum, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HanhDong } from '../../../shared/constants/hanh-dong.enum';

/**
 * DTO để gán quyền cho vai trò
 */
export class GanQuyenDto {
  /**
   * ID vai trò
   */
  @IsNotEmpty({ message: 'ID vai trò không được để trống' })
  @IsInt({ message: 'ID vai trò phải là số nguyên' })
  vai_tro_id: number;


  /**
   * Danh sách các hành động được phép
   */
  @IsNotEmpty({ message: 'Danh sách hành động không được để trống' })
  @IsArray({ message: 'Hành động phải là mảng' })
  @ArrayMinSize(1, { message: 'Phải có ít nhất 1 hành động' })
  @IsEnum(HanhDong, { each: true, message: 'Hành động không hợp lệ' })
  hanh_dong: HanhDong[];
}

/**
 * DTO để gán quyền hàng loạt cho vai trò
 */
export class GanQuyenHangLoatDto {
  /**
   * ID vai trò
   */
  @IsNotEmpty({ message: 'ID vai trò không được để trống' })
  @IsInt({ message: 'ID vai trò phải là số nguyên' })
  vai_tro_id: number;

  /**
   * Danh sách quyền theo từng module
   */
  @IsNotEmpty({ message: 'Danh sách quyền không được để trống' })
  @IsArray({ message: 'Quyền phải là mảng' })
  @ArrayMinSize(1, { message: 'Phải có ít nhất 1 module' })
  @ValidateNested({ each: true })
  @Type(() => QuyenModule)
  quyen_module: QuyenModule[];
}

/**
 * Class helper cho từng module và quyền của nó
 */
export class QuyenModule {
  /**
   * ID module hệ thống
   */
  @IsNotEmpty({ message: 'ID module không được để trống' })
  @IsInt({ message: 'ID module phải là số nguyên' })
  module_he_thong_id: number;

  /**
   * Danh sách các hành động
   */
  @IsArray({ message: 'Hành động phải là mảng' })
  @IsEnum(HanhDong, { each: true, message: 'Hành động không hợp lệ' })
  hanh_dong: HanhDong[];
}

/**
 * Response trả về danh sách quyền của vai trò
 */
export interface QuyenCuaVaiTro {
  vai_tro_id: number;
  ten_vai_tro: string;
  quyen: {
    module_id: number;
    ma_module: string;
    ten_module: string;
    hanh_dong: HanhDong[];
  }[];
}
