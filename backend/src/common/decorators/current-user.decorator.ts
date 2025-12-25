import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator để lấy thông tin user hiện tại từ request
 * User được gán vào request sau khi JWT được validate thành công
 * 
 * Sử dụng:
 * @Get('profile')
 * getProfile(@CurrentUser() user: any) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Nếu có truyền tên field cụ thể, trả về field đó
    return data ? user?.[data] : user;
  },
);
