import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { DanhSachSoLuongThiNghiemService } from './danh-sach-so-luong-thi-nghiem.service';
import { 
  CreateDanhSachSoLuongThiNghiemDto, 
  UpdateDanhSachSoLuongThiNghiemDto 
} from './dto/de-cuong-thi-nghiem.dto';

/**
 * Controller xử lý API cho Danh Sách Số Lượng Thí Nghiệm
 */
@Controller('de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DanhSachSoLuongThiNghiemController {
  constructor(
    private readonly danhSachSoLuongThiNghiemService: DanhSachSoLuongThiNghiemService,
  ) {}

  /**
   * Tạo danh sách số lượng thí nghiệm mới
   * POST /api/de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong
   */
  @Post()
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.THAO_TAC)
  async tao(
    @Param('deCuongId', ParseIntPipe) deCuongId: number,
    @Body() createDto: CreateDanhSachSoLuongThiNghiemDto,
  ) {
    const danhSach = await this.danhSachSoLuongThiNghiemService.tao(deCuongId, createDto);
    return {
      success: true,
      message: 'Thêm danh sách số lượng thí nghiệm thành công',
      data: danhSach,
    };
  }

  /**
   * Lấy danh sách số lượng thí nghiệm
   * GET /api/de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong
   */
  @Get()
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.XEM)
  async layDanhSach(@Param('deCuongId', ParseIntPipe) deCuongId: number) {
    const danhSach = await this.danhSachSoLuongThiNghiemService.layDanhSach(deCuongId);
    return {
      success: true,
      data: danhSach,
    };
  }

  /**
   * Lấy chi tiết danh sách số lượng thí nghiệm
   * GET /api/de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong/:id
   */
  @Get(':id')
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.XEM)
  async layTheoId(@Param('id', ParseIntPipe) id: number) {
    const danhSach = await this.danhSachSoLuongThiNghiemService.layTheoId(id);
    return {
      success: true,
      data: danhSach,
    };
  }

  /**
   * Cập nhật danh sách số lượng thí nghiệm
   * PATCH /api/de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong/:id
   */
  @Patch(':id')
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDanhSachSoLuongThiNghiemDto,
  ) {
    const danhSach = await this.danhSachSoLuongThiNghiemService.capNhat(id, updateDto);
    return {
      success: true,
      message: 'Cập nhật danh sách số lượng thí nghiệm thành công',
      data: danhSach,
    };
  }

  /**
   * Xóa danh sách số lượng thí nghiệm
   * DELETE /api/de-cuong-thi-nghiem/:deCuongId/danh-sach-so-luong/:id
   */
  @Delete(':id')
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.danhSachSoLuongThiNghiemService.xoa(id);
    return {
      success: true,
      message: 'Xóa danh sách số lượng thí nghiệm thành công',
    };
  }
}
