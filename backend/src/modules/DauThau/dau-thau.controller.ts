import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { DauThauService } from './dau-thau.service';
import { CreateDauThauDto, UpdateDauThauDto, FilterDauThauDto } from './dto/dau-thau.dto';
import { ExcelUtils } from '../../shared/utils/excel.utils';

/**
 * Controller xử lý API cho Đấu Thầu
 */
@Controller('dau-thau')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DauThauController {
  constructor(private readonly dauThauService: DauThauService) {}

  /**
   * Tạo đấu thầu mới
   * POST /api/dau-thau
   */
  @Post()
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  async tao(@Body() createDauThauDto: CreateDauThauDto, @CurrentUser() user: any) {
    const dauThau = await this.dauThauService.tao(createDauThauDto, user.id);
    return {
      success: true,
      message: 'Tạo đấu thầu thành công',
      data: dauThau,
    };
  }

  /**
   * Lấy danh sách đấu thầu có phân trang và filter
   * GET /api/dau-thau
   */
  @Get()
  @RequirePermission('DAU_THAU', HanhDong.XEM)
  async layDanhSach(@Query() filterDto: FilterDauThauDto) {
    return this.dauThauService.layDanhSach(filterDto);
  }

  /**
   * Export danh sách đấu thầu ra file Excel
   * GET /api/dau-thau/export
   */
  @Get('export')
  @RequirePermission('DAU_THAU', HanhDong.XEM)
  async export(@Query() filterDto: FilterDauThauDto, @Res() res: Response) {
    // Lấy danh sách (không phân trang)
    const danhSach = await this.dauThauService.layDanhSachExport(filterDto);

    // Thêm STT (1, 2, 3...)
    const dataWithSTT = danhSach.map((item, index) => ({
      ...item,
      stt: index + 1,
    }));

    // Cấu hình các cột Excel (theo thứ tự frontend)
    const columns = [
      { header: 'STT', key: 'stt', width: 10 },
      { header: 'Tên đề tài', key: 'deTai.ten_de_tai', width: 40 },
      { header: 'Năm', key: 'nam_thuc_hien', width: 12 },
      { header: 'Tổng kinh phí', key: 'tong_kinh_phi', width: 18 },
      { header: 'Nguồn kinh phí', key: 'nguon_kinh_phi', width: 30 },
      { header: 'Người cập nhật', key: 'nguoi_cap_nhat.ho_ten', width: 25 },
    ];

    // Generate Excel buffer
    const buffer = await ExcelUtils.generateExcel(
      dataWithSTT,
      columns,
      'Danh sách đấu thầu',
    );

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="danh-sach-dau-thau-${new Date().getTime()}.xlsx"`,
    );

    res.send(buffer);
  }

  /**
   * Lấy chi tiết đấu thầu
   * GET /api/dau-thau/:id
   */
  @Get(':id')
  @RequirePermission('DAU_THAU', HanhDong.XEM)
  async layTheoId(@Param('id', ParseIntPipe) id: number) {
    const dauThau = await this.dauThauService.layTheoId(id);
    return {
      success: true,
      data: dauThau,
    };
  }

  /**
   * Cập nhật đấu thầu
   * PATCH /api/dau-thau/:id
   */
  @Patch(':id')
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDauThauDto: UpdateDauThauDto,
    @CurrentUser() user: any,
  ) {
    const dauThau = await this.dauThauService.capNhat(id, updateDauThauDto, user.id);
    return {
      success: true,
      message: 'Cập nhật đấu thầu thành công',
      data: dauThau,
    };
  }

  /**
   * Xóa đấu thầu (cascade xóa các con)
   * DELETE /api/dau-thau/:id
   */
  @Delete(':id')
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.dauThauService.xoa(id);
    return {
      success: true,
      message: 'Xóa đấu thầu thành công',
    };
  }
}
