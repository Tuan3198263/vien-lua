import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY, PermissionMetadata } from '../decorators/require-permission.decorator';
import { PhanQuyenService } from '../../modules/PhanQuyen/phan-quyen.service';

/**
 * Permission Guard
 * Kiểm tra quyền của user trước khi cho phép truy cập route
 * Sử dụng kết hợp với @RequirePermission decorator
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private phanQuyenService: PhanQuyenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lấy permission metadata từ decorator
    const permission = this.reflector.getAllAndOverride<PermissionMetadata>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu không có @RequirePermission decorator, cho phép truy cập
    if (!permission) {
      return true;
    }

    // Lấy user từ request (đã được set bởi JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.vai_tro) {
      throw new ForbiddenException('Không có thông tin vai trò');
    }

    // Kiểm tra quyền
    const hasPermission = await this.phanQuyenService.kiemTraQuyen(
      user.vai_tro.id,
      permission.module,
      permission.action,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Bạn không có quyền ${permission.action} trên module ${permission.module}`,
      );
    }

    return true;
  }
}
