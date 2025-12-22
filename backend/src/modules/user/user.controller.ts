import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

/**
 * User Controller
 * Xử lý các API endpoints liên quan đến User
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Lấy danh sách tất cả users
   * GET /api/users
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Đếm số lượng users
   * GET /api/users/count
   */
  @Get('count')
  count() {
    return this.userService.count();
  }
}
