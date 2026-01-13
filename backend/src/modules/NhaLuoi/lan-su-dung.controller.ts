import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { LanSuDungService } from './lan-su-dung.service';
import { CreateLanSuDungDto, UpdateLanSuDungDto } from './dto/nha-luoi.dto';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';
import { UploadFileDto } from '../FileHeThong/dto/file-he-thong.dto';

/**
 * Controller xử lý API cho Lần Sử Dụng (sub-module)
 * Upload file được tích hợp vào thêm/sửa
 */
@Controller('nha-luoi/:nhaLuoiId/lan-su-dung')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class LanSuDungController {
  constructor(
    private readonly lanSuDungService: LanSuDungService,
    private readonly fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo lần sử dụng mới KÈM FILE (nếu có)
   * POST /api/nha-luoi/:nhaLuoiId/lan-su-dung
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - de_cuong_thi_nghiem_id: number (required)
   * - dung_cu: string (optional)
   * - so_luong: number (optional)
   * - ngay_muon: YYYY-MM-DD (optional)
   * - ngay_tra: YYYY-MM-DD (optional)
   * - khau_hao: number (optional)
   * - hien_trang: string (optional)
   * - file: binary (optional)
   * 
   * @permission NHA_LUOI - THAO_TAC
   */
  @Post()
  @RequirePermission('NHA_LUOI', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async tao(
    @Param('nhaLuoiId', ParseIntPipe) nhaLuoiId: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // Validate required fields
    if (!body.de_cuong_thi_nghiem_id) {
      throw new BadRequestException('Đề cương thí nghiệm không được để trống');
    }

    // 1. Tạo lần sử dụng trước
    const createDto: CreateLanSuDungDto = {
      de_cuong_thi_nghiem_id: parseInt(body.de_cuong_thi_nghiem_id),
      dung_cu: body.dung_cu,
      so_luong: body.so_luong ? parseFloat(body.so_luong) : undefined,
      ngay_muon: body.ngay_muon,
      ngay_tra: body.ngay_tra,
      khau_hao: body.khau_hao ? parseFloat(body.khau_hao) : undefined,
      hien_trang: body.hien_trang,
    };
    const lanSuDung = await this.lanSuDungService.tao(
      nhaLuoiId,
      createDto,
      user.id,
      file?.originalname,
    );

    // 2. Upload file (nếu có)
    let fileInfo = null;
    if (file) {
      try {
        const uploadDto: UploadFileDto = {
          module: 'LAN_SU_DUNG',
          ban_ghi_id: lanSuDung.id,
          ten_truong: 'file_lan_su_dung',
        };
        fileInfo = await this.fileHeThongService.uploadFile(
          file,
          uploadDto,
          user.id,
        );
      } catch (error) {
        console.error('Lỗi upload file:', error);
      }
    }

    return {
      success: true,
      message: 'Thêm lần sử dụng thành công',
      data: {
        ...lanSuDung,
        file_lan_su_dung: fileInfo,
      },
    };
  }

  /**
   * Lấy danh sách lần sử dụng của nhà lưới (kèm file info)
   * GET /api/nha-luoi/:nhaLuoiId/lan-su-dung
   * 
   * @permission NHA_LUOI - XEM (mặc định)
   */
  @Get()
  @RequirePermission('NHA_LUOI', HanhDong.XEM)
  async layDanhSach(@Param('nhaLuoiId', ParseIntPipe) nhaLuoiId: number) {
    const danhSach = await this.lanSuDungService.layDanhSach(nhaLuoiId);
    return {
      success: true,
      data: danhSach,
    };
  }

  /**
   * Cập nhật lần sử dụng KÈM FILE (nếu có)
   * PATCH /api/nha-luoi/:nhaLuoiId/lan-su-dung/:id
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - de_cuong_thi_nghiem_id: number (optional)
   * - dung_cu: string (optional)
   * - so_luong: number (optional)
   * - ngay_muon: YYYY-MM-DD (optional)
   * - ngay_tra: YYYY-MM-DD (optional)
   * - khau_hao: number (optional)
   * - hien_trang: string (optional)
   * - xoa_file: boolean (optional)
   * - file: binary (optional)
   * 
   * @permission NHA_LUOI - THAO_TAC
   */
  @Patch(':id')
  @RequirePermission('NHA_LUOI', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // 1. Cập nhật thông tin (nếu có)
    let lanSuDung = null;
    if (
      body.de_cuong_thi_nghiem_id ||
      body.dung_cu ||
      body.so_luong ||
      body.ngay_muon ||
      body.ngay_tra ||
      body.khau_hao ||
      body.hien_trang
    ) {
      const updateDto: UpdateLanSuDungDto = {
        de_cuong_thi_nghiem_id: body.de_cuong_thi_nghiem_id
          ? parseInt(body.de_cuong_thi_nghiem_id)
          : undefined,
        dung_cu: body.dung_cu,
        so_luong: body.so_luong ? parseFloat(body.so_luong) : undefined,
        ngay_muon: body.ngay_muon,
        ngay_tra: body.ngay_tra,
        khau_hao: body.khau_hao ? parseFloat(body.khau_hao) : undefined,
        hien_trang: body.hien_trang,
      };
      lanSuDung = await this.lanSuDungService.capNhat(
        id,
        updateDto,
        user.id,
        file?.originalname,
      );
    } else {
      lanSuDung = await this.lanSuDungService.layTheoId(id);
    }

    // 2. Xóa file (nếu yêu cầu)
    if (body.xoa_file === 'true' || body.xoa_file === true) {
      try {
        await this.fileHeThongService.xoaFile({
          module: 'LAN_SU_DUNG',
          ban_ghi_id: id,
          ten_truong: 'file_lan_su_dung',
        });
      } catch (error) {
        console.error('Lỗi xóa file:', error);
      }
    }

    // 3. Upload file mới (nếu có)
    let fileInfo = null;
    if (file) {
      try {
        const uploadDto: UploadFileDto = {
          module: 'LAN_SU_DUNG',
          ban_ghi_id: id,
          ten_truong: 'file_lan_su_dung',
        };
        fileInfo = await this.fileHeThongService.uploadFile(
          file,
          uploadDto,
          user.id,
        );
      } catch (error) {
        console.error('Lỗi upload file:', error);
      }
    }

    return {
      success: true,
      message: 'Cập nhật lần sử dụng thành công',
      data: {
        ...lanSuDung,
        file_lan_su_dung: fileInfo,
      },
    };
  }

  /**
   * Xóa lần sử dụng (bao gồm cả file)
   * DELETE /api/nha-luoi/:nhaLuoiId/lan-su-dung/:id
   * 
   * @permission NHA_LUOI - THAO_TAC
   */
  @Delete(':id')
  @RequirePermission('NHA_LUOI', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.lanSuDungService.xoa(id);
    return {
      success: true,
      message: 'Xóa lần sử dụng thành công',
    };
  }
}
