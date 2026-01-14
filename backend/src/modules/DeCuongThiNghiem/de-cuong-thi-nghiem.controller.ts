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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { ExcelUtils } from '../../shared/utils/excel.utils';
import { DeCuongThiNghiemService } from './de-cuong-thi-nghiem.service';
import { 
  CreateDeCuongThiNghiemDto, 
  UpdateDeCuongThiNghiemDto, 
  FilterDeCuongThiNghiemDto 
} from './dto/de-cuong-thi-nghiem.dto';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';
import { UploadFileDto } from '../FileHeThong/dto/file-he-thong.dto';

/**
 * Controller xử lý API cho Đề Cương Thí Nghiệm
 */
@Controller('de-cuong-thi-nghiem')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DeCuongThiNghiemController {
  constructor(
    private readonly deCuongThiNghiemService: DeCuongThiNghiemService,
    private readonly fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo đề cương thí nghiệm mới KÈM FILE (nếu có)
   * POST /api/de-cuong-thi-nghiem
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - de_tai_id: number
   * - ten_thi_nghiem: string
   * - loai_hinh_thi_nghiem: string
   * - ngay_bat_dau: date (YYYY-MM-DD)
   * - ngay_ket_thuc: date (YYYY-MM-DD)
   * - mua_vu: string
   * - nguoi_thuc_hien: string
   * - kinh_phi_ky_thuat: number
   * - kinh_phi_lao_dong: number
   * - kinh_phi_nguyen_vat_lieu: number
   * - file: binary (optional)
   */
  @Post()
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async tao(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any
  ) {
    // Validate data thủ công (vì multipart/form-data)
    if (!body.de_tai_id || !body.ten_thi_nghiem || !body.loai_hinh_thi_nghiem ||
        !body.ngay_bat_dau || !body.ngay_ket_thuc || !body.mua_vu ||
        !body.nguoi_thuc_hien || body.kinh_phi_ky_thuat === undefined ||
        body.kinh_phi_lao_dong === undefined || body.kinh_phi_nguyen_vat_lieu === undefined) {
      throw new BadRequestException('Các trường bắt buộc không được để trống');
    }

    // 1. Tạo đề cương thí nghiệm trước (để có ID)
    const createDto: CreateDeCuongThiNghiemDto = {
      de_tai_id: parseInt(body.de_tai_id),
      ten_thi_nghiem: body.ten_thi_nghiem,
      loai_hinh_thi_nghiem: body.loai_hinh_thi_nghiem,
      ngay_bat_dau: body.ngay_bat_dau,
      ngay_ket_thuc: body.ngay_ket_thuc,
      mua_vu: body.mua_vu,
      nguoi_thuc_hien: body.nguoi_thuc_hien,
      kinh_phi_ky_thuat: parseFloat(body.kinh_phi_ky_thuat),
      kinh_phi_lao_dong: parseFloat(body.kinh_phi_lao_dong),
      kinh_phi_nguyen_vat_lieu: parseFloat(body.kinh_phi_nguyen_vat_lieu),
    };

    const deCuong = await this.deCuongThiNghiemService.tao(createDto, user.id, null);

    // 2. Upload file (nếu có) sau khi đã có ID
    let fileId = null;
    if (file) {
      try {
        const uploadDto: UploadFileDto = {
          module: 'DE_CUONG_THI_NGHIEM',
          ban_ghi_id: deCuong.id,
          ten_truong: 'file_de_cuong',
        };
        const fileInfo = await this.fileHeThongService.uploadFile(
          file,
          uploadDto,
          user.id,
        );
        fileId = fileInfo.id;
        
        // Cập nhật file_de_cuong_id vào entity
        await this.deCuongThiNghiemService.capNhat(deCuong.id, {}, user.id, fileId);
      } catch (error) {
        console.error('Lỗi upload file:', error);
        throw new BadRequestException('Lỗi upload file');
      }
    }

    return {
      success: true,
      message: 'Tạo đề cương thí nghiệm thành công',
      data: deCuong,
    };
  }

  /**
   * Lấy danh sách đề cương thí nghiệm có phân trang và filter
   * GET /api/de-cuong-thi-nghiem
   */
  @Get()
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.XEM)
  async layDanhSach(@Query() filterDto: FilterDeCuongThiNghiemDto) {
    return this.deCuongThiNghiemService.layDanhSach(filterDto);
  }

  /**
   * Export danh sách đề cương thí nghiệm ra file Excel
   * GET /api/de-cuong-thi-nghiem/export
   */
  @Get('export')
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.XEM)
  async export(@Query() filterDto: FilterDeCuongThiNghiemDto, @Res() res: Response) {
    // Lấy danh sách (không phân trang)
    const danhSach = await this.deCuongThiNghiemService.layDanhSachExport(filterDto);

    // Thêm STT (1, 2, 3...)
    const dataWithSTT = danhSach.map((item, index) => ({
      ...item,
      stt: index + 1,
    }));

    // Cấu hình các cột Excel (theo thứ tự frontend)
    const columns = [
      { header: 'STT', key: 'stt', width: 10 },
      { header: 'Tên đề tài', key: 'deTai.ten_de_tai', width: 30 },
      { header: 'Cấp đề tài', key: 'deTai.cap_quan_ly_de_tai', width: 20 },
      { header: 'Đơn vị phê duyệt', key: 'deTai.don_vi_phe_duyet', width: 25 },
      { header: 'Chủ nhiệm đề tài', key: 'deTai.chu_nhiem_de_tai', width: 25 },
      { header: 'Tên thí nghiệm', key: 'ten_thi_nghiem', width: 30 },
      { header: 'Loại hình thí nghiệm', key: 'loai_hinh_thi_nghiem', width: 25 },
      { header: 'Kinh phí kỹ thuật', key: 'kinh_phi_ky_thuat', width: 18 },
      { header: 'Kinh phí lao động', key: 'kinh_phi_lao_dong', width: 18 },
      { header: 'Kinh phí NVL', key: 'kinh_phi_nguyen_vat_lieu', width: 18 },
      { header: 'Mùa vụ', key: 'mua_vu', width: 15 },
      { header: 'Người thực hiện', key: 'nguoi_thuc_hien', width: 25 },
      { header: 'Ngày bắt đầu', key: 'ngay_bat_dau', width: 15 },
      { header: 'Ngày kết thúc', key: 'ngay_ket_thuc', width: 15 },
      { header: 'Người cập nhật', key: 'nguoi_cap_nhat.ho_ten', width: 25 },
    ];

    // Generate Excel buffer
    const buffer = await ExcelUtils.generateExcel(
      dataWithSTT,
      columns,
      'Danh sách đề cương thí nghiệm',
    );

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="danh-sach-de-cuong-thi-nghiem-${new Date().getTime()}.xlsx"`,
    );

    res.send(buffer);
  }

  /**
   * Lấy chi tiết đề cương thí nghiệm
   * GET /api/de-cuong-thi-nghiem/:id
   */
  @Get(':id')
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.XEM)
  async layTheoId(@Param('id', ParseIntPipe) id: number) {
    const deCuong = await this.deCuongThiNghiemService.layTheoId(id);
    return {
      success: true,
      data: deCuong,
    };
  }

  /**
   * Cập nhật đề cương thí nghiệm KÈM FILE (nếu có)
   * PATCH /api/de-cuong-thi-nghiem/:id
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - Các fields thông tin (optional)
   * - file: binary (optional, upload file mới)
   * - xoa_file: boolean (optional, true = xóa file hiện tại)
   */
  @Patch(':id')
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // 1. Cập nhật thông tin đề cương
    const updateDto: UpdateDeCuongThiNghiemDto = {};
    if (body.de_tai_id) updateDto.de_tai_id = parseInt(body.de_tai_id);
    if (body.ten_thi_nghiem) updateDto.ten_thi_nghiem = body.ten_thi_nghiem;
    if (body.loai_hinh_thi_nghiem) updateDto.loai_hinh_thi_nghiem = body.loai_hinh_thi_nghiem;
    if (body.ngay_bat_dau) updateDto.ngay_bat_dau = body.ngay_bat_dau;
    if (body.ngay_ket_thuc) updateDto.ngay_ket_thuc = body.ngay_ket_thuc;
    if (body.mua_vu) updateDto.mua_vu = body.mua_vu;
    if (body.nguoi_thuc_hien) updateDto.nguoi_thuc_hien = body.nguoi_thuc_hien;
    if (body.kinh_phi_ky_thuat !== undefined) updateDto.kinh_phi_ky_thuat = parseFloat(body.kinh_phi_ky_thuat);
    if (body.kinh_phi_lao_dong !== undefined) updateDto.kinh_phi_lao_dong = parseFloat(body.kinh_phi_lao_dong);
    if (body.kinh_phi_nguyen_vat_lieu !== undefined) updateDto.kinh_phi_nguyen_vat_lieu = parseFloat(body.kinh_phi_nguyen_vat_lieu);

    // 2. Xóa file (nếu yêu cầu)
    if (body.xoa_file === 'true' || body.xoa_file === true) {
      try {
        await this.deCuongThiNghiemService.xoaFileDeCuong(id);
      } catch (error) {
        console.error('Lỗi xóa file:', error);
      }
    }

    // 3. Upload file mới (nếu có)
    let fileId = undefined;
    if (file) {
      try {
        const uploadDto: UploadFileDto = {
          module: 'DE_CUONG_THI_NGHIEM',
          ban_ghi_id: id,
          ten_truong: 'file_de_cuong',
        };
        const fileInfo = await this.fileHeThongService.uploadFile(
          file,
          uploadDto,
          user.id,
        );
        fileId = fileInfo.id;
      } catch (error) {
        console.error('Lỗi upload file:', error);
        throw new BadRequestException('Lỗi upload file');
      }
    }

    const deCuong = await this.deCuongThiNghiemService.capNhat(id, updateDto, user.id, fileId);
    
    return {
      success: true,
      message: 'Cập nhật đề cương thí nghiệm thành công',
      data: deCuong,
    };
  }

  /**
   * Xóa đề cương thí nghiệm (cascade xóa các con và files)
   * DELETE /api/de-cuong-thi-nghiem/:id
   */
  @Delete(':id')
  @RequirePermission('DE_CUONG_THI_NGHIEM', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.deCuongThiNghiemService.xoa(id);
    return {
      success: true,
      message: 'Xóa đề cương thí nghiệm thành công',
    };
  }
}
