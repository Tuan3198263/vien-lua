import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PhanQuyenService } from './phan-quyen.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

/**
 * Controller xử lý các API liên quan đến Phân Quyền
 * Base path: /api/phan-quyen
 * 
 * NOTE: Việc gán quyền được xử lý trực tiếp khi tạo/sửa vai trò
 * Controller này chỉ phục vụ xem quyền và các tiện ích
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
    return await this.phanQuyenService.layDanhSachModule();
  }

  /**
   * API: Lấy danh sách quyền của vai trò
   * Method: GET /api/phan-quyen/vai-tro/:id
   * Auth: Required
   */
  @Get('vai-tro/:id')
  async layQuyenCuaVaiTro(@Param('id', ParseIntPipe) id: number) {
    return await this.phanQuyenService.layQuyenCuaVaiTro(id);
  }

  /**
   * API: Xóa một quyền cụ thể
   * Method: DELETE /api/phan-quyen/:id
   * Auth: Required
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async xoaQuyen(@Param('id', ParseIntPipe) id: number) {
    return await this.phanQuyenService.remove(id);
  }

  /**
   * API: Xóa tất cả quyền của vai trò
   * Method: DELETE /api/phan-quyen/vai-tro/:id
   * Auth: Required
   */
  @Delete('vai-tro/:id')
  @HttpCode(HttpStatus.OK)
  async xoaTatCaQuyenCuaVaiTro(@Param('id', ParseIntPipe) id: number) {
    return await this.phanQuyenService.removeByVaiTro(id);
  }
}
