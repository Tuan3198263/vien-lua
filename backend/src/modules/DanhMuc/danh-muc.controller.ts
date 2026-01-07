import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import {
  DANH_SACH_DANH_MUC,
  layDanhMucTheoMa,
  layNhieuDanhMuc,
  layDanhMucTheoModule,
} from '../../shared/constants/danh-muc.constant';

/**
 * Controller đơn giản trả về danh mục từ constants
 * Không cần database, không cần authentication
 */
@Controller('danh-muc')
export class DanhMucController {
  /**
   * Lấy tất cả danh mục
   * GET /api/danh-muc
   */
  @Get()
  @Public()
  async layTatCa() {
    return {
      success: true,
      data: DANH_SACH_DANH_MUC,
    };
  }

  /**
   * Lấy danh mục theo mã
   * GET /api/danh-muc/ma/:ma
   * Ví dụ: /api/danh-muc/ma/DON_VI_PHE_DUYET
   */
  @Get('ma/:ma')
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

  /**
   * Lấy nhiều danh mục cùng lúc
   * POST /api/danh-muc/lay-nhieu
   * Body: { ma_danh_muc: ["DON_VI_PHE_DUYET", "LINH_VUC_KHOA_HOC"] }
   */
  @Post('lay-nhieu')
  @Public()
  async layNhieu(@Body('ma_danh_muc') maDanhMucs: string[]) {
    const danhMucs = layNhieuDanhMuc(maDanhMucs);

    return {
      success: true,
      data: danhMucs,
    };
  }

  /**
   * Lấy tất cả danh mục của 1 module
   * GET /api/danh-muc/module/:module
   * Ví dụ: /api/danh-muc/module/HOP_DONG
   */
  @Get('module/:module')
  @Public()
  async layTheoModule(@Param('module') module: string) {
    const danhMucs = layDanhMucTheoModule(module);

    return {
      success: true,
      data: danhMucs,
    };
  }
}
