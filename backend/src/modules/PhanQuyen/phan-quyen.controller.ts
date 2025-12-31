import { Controller, Get, UseGuards } from '@nestjs/common';
import { PhanQuyenService } from './phan-quyen.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

/**
 * Controller xử lý các API liên quan đến Phân Quyền
 * Base path: /api/phan-quyen
 * 
 * NOTE: Việc gán quyền được xử lý trực tiếp khi tạo/sửa vai trò
 * Controller này chỉ cung cấp danh sách module
 */
@Controller('phan-quyen')
@UseGuards(JwtAuthGuard)
export class PhanQuyenController {
  constructor(private readonly phanQuyenService: PhanQuyenService) {}

  /**
   * API: Lấy danh sách tất cả module trong hệ thống
   * Method: GET /api/phan-quyen/modules
   * Auth: Public - Frontend cần để hiển thị form phân quyền
   */
  @Get('modules')
  @Public()
  async layDanhSachModule() {
    const modules = await this.phanQuyenService.layDanhSachModule();
    return {
      success: true,
      data: modules,
    };
  }
}
