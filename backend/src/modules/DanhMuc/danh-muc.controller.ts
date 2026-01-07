import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { layDanhMucTheoMa } from '../../shared/constants/danh-muc.constant';

/**
 * Controller đơn giản trả về danh mục từ constants
 * Không cần database, không cần authentication
 */
@Controller('danh-muc')
export class DanhMucController {
  /**
   * Lấy danh mục theo mã
   * GET /api/danh-muc/:ma
   * Ví dụ: /api/danh-muc/DON_VI_PHE_DUYET
   */
  @Get(':ma')
  @Public()
  async layTheoMa(@Param('ma') ma: string) {
    const danhMuc = layDanhMucTheoMa(ma);

    if (!danhMuc) {
      return {
        success: false,
        message: `Không tìm thấy danh mục với mã ${ma}`,
      };
    }

    return {
      success: true,
      data: danhMuc,
    };
  }
}
