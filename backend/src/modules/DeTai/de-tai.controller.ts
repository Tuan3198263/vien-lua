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
import { DeTaiService } from './de-tai.service';
import { CreateDeTaiDto, UpdateDeTaiDto, FilterDeTaiDto } from './dto/de-tai.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { ExcelUtils } from '../../shared/utils/excel.utils';

@Controller('de-tai')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DeTaiController {
  constructor(private readonly deTaiService: DeTaiService) {}

  @Post()
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async tao(@Body() createDeTaiDto: CreateDeTaiDto, @CurrentUser() user: any) {
    const deTai = await this.deTaiService.tao(createDeTaiDto, user.id);
    return {
      success: true,
      message: 'Tạo đề tài thành công',
      data: deTai,
    };
  }

  @Get()
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layDanhSach(@Query() filterDto: FilterDeTaiDto) {
    return this.deTaiService.layDanhSach(filterDto);
  }

  /**
   * Export danh sách đề tài ra file Excel
   * Endpoint: GET /api/de-tai/export
   * 
   * Query parameters (giống như layDanhSach, nhưng không có page/limit):
   * - search: Tìm kiếm theo tên đề tài, mã đề tài, chủ nhiệm
   * - sort: Sắp xếp (ví dụ: "ngay_tao:DESC")
   * - Các filter khác: cap_quan_ly_de_tai, linh_vuc_khoa_hoc, v.v.
   * 
   * Response: File Excel (.xlsx) được download tự động
   */
  @Get('export')
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async export(@Query() filterDto: FilterDeTaiDto, @Res() res: Response) {
    // Lấy danh sách đề tài (không phân trang, có filter)
    const danhSach = await this.deTaiService.layDanhSachExport(filterDto);

    // Map thêm STT (1, 2, 3...) thay vì dùng id
    const danhSachWithSTT = danhSach.map((item, index) => ({
      ...item,
      stt: index + 1, // STT bắt đầu từ 1
    }));

    // Cấu hình các cột cho Excel (theo thứ tự table frontend)
    const columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Mã đề tài', key: 'ma_de_tai', width: 15 },
      { header: 'Tên đề tài', key: 'ten_de_tai', width: 45 },
      { header: 'Đơn vị phê duyệt', key: 'don_vi_phe_duyet', width: 25 },
      { header: 'Cấp quản lý đề tài', key: 'cap_quan_ly_de_tai', width: 22 },
      { header: 'Phương thức khoáng chi', key: 'phuong_thuc_khoang_chi', width: 30 },
      { header: 'Nội dung khoáng chi', key: 'noi_dung_khoang_chi', width: 30 },
      { header: 'Lĩnh vực khoa học', key: 'linh_vuc_khoa_hoc', width: 25 },
      { header: 'Nguồn gốc đề tài', key: 'nguon_goc_de_tai', width: 25 },
      { header: 'Hợp đồng', key: 'hop_dong', width: 20 },
      { header: 'Biên bản thanh lý', key: 'bien_ban_thanh_ly', width: 25 },
      { header: 'Ngày bắt đầu', key: 'ngay_bat_dau', width: 18 },
      { header: 'Ngày kết thúc', key: 'ngay_ket_thuc', width: 18 },
      { header: 'Chủ nhiệm đề tài', key: 'chu_nhiem_de_tai', width: 25 },
      { header: 'Thư ký đề tài', key: 'thu_ky_de_tai', width: 25 },
      { header: 'Người cập nhật', key: 'nguoi_cap_nhat.ho_ten', width: 25 },
    ];

    // Tạo file Excel
    const excelBuffer = await ExcelUtils.generateExcel(
      danhSachWithSTT,
      columns,
      'Danh sách đề tài',
    );

    // Tạo tên file với timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `DanhSachDeTai_${timestamp}.xlsx`;

    // Set headers để browser tự động download file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', excelBuffer.length);

    // Gửi buffer về client
    res.send(excelBuffer);
  }

  @Get(':id')
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layTheoId(@Param('id', ParseIntPipe) id: number) {
    const deTai = await this.deTaiService.layTheoId(id);
    return {
      success: true,
      data: deTai,
    };
  }

  @Patch(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeTaiDto: UpdateDeTaiDto,
    @CurrentUser() user: any,
  ) {
    const deTai = await this.deTaiService.capNhat(id, updateDeTaiDto, user.id);
    return {
      success: true,
      message: 'Cập nhật đề tài thành công',
      data: deTai,
    };
  }

  @Delete(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.deTaiService.xoa(id);
    return {
      success: true,
      message: 'Xóa đề tài thành công',
    };
  }
}
