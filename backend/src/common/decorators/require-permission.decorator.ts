import { SetMetadata } from '@nestjs/common';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';

/**
 * Key để lưu metadata của permission
 */
export const PERMISSION_KEY = 'permission';

/**
 * Interface định nghĩa permission cần kiểm tra
 */
export interface PermissionMetadata {
  /**
   * Mã module cần kiểm tra quyền
   */
  module: string;

  /**
   * Hành động cần kiểm tra
   */
  action: HanhDong;
}

/**
 * Decorator để yêu cầu quyền cụ thể trên một route
 * Sử dụng kết hợp với PermissionGuard
 * 
 * Ví dụ:
 * @RequirePermission('NGUOI_DUNG', HanhDong.THEM)
 * @Post()
 * async create() { ... }
 */
export const RequirePermission = (module: string, action: HanhDong) =>
  SetMetadata(PERMISSION_KEY, { module, action } as PermissionMetadata);
