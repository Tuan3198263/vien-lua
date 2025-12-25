import { SetMetadata } from '@nestjs/common';

/**
 * Decorator để đánh dấu route là public (không cần xác thực)
 * Sử dụng: @Public() trước controller hoặc handler method
 * 
 * Ví dụ:
 * @Public()
 * @Post('login')
 * async login() { ... }
 */
export const Public = () => SetMetadata('isPublic', true);
