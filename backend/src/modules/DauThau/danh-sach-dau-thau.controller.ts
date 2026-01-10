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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { DanhSachDauThauService } from './danh-sach-dau-thau.service';
import { CreateDanhSachDauThauDto, UpdateDanhSachDauThauDto } from './dto/dau-thau.dto';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';
import { UploadFileDto } from '../FileHeThong/dto/file-he-thong.dto';

/**
 * Controller xử lý API cho Danh Sách Đấu Thầu
 * Upload file được tích hợp vào thêm/sửa (giống HoSoLuuTru)
 */
@Controller('dau-thau/:dauThauId/danh-sach')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DanhSachDauThauController {
  constructor(
    private readonly danhSachDauThauService: DanhSachDauThauService,
    private readonly fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo danh sách đấu thầu mới KÈM FILE (nếu có)
   * POST /api/dau-thau/:dauThauId/danh-sach
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - nam: number
   * - kinh_phi: number
   * - hinh_thuc: string
   * - buoc: string
   * - trang_thai: string
   * - file: binary (optional)
   */
  @Post()
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async tao(
    @Param('dauThauId', ParseIntPipe) dauThauId: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // Validate data thủ công (vì multipart/form-data)
    if (!body.nam || !body.kinh_phi || !body.hinh_thuc || !body.buoc || !body.trang_thai) {
      throw new BadRequestException('Các trường bắt buộc không được để trống');
    }

    // 1. Tạo danh sách đấu thầu trước
    const createDto: CreateDanhSachDauThauDto = {
      nam: parseInt(body.nam),
      kinh_phi: parseFloat(body.kinh_phi),
      hinh_thuc: body.hinh_thuc,
      buoc: body.buoc,
      trang_thai: body.trang_thai,
    };
    const danhSach = await this.danhSachDauThauService.tao(dauThauId, createDto, file?.originalname);

    // 2. Upload file (nếu có)
    let fileInfo = null;
    if (file) {
      try {
        const uploadDto: UploadFileDto = {
          module: 'DAU_THAU',
          ban_ghi_id: danhSach.id,
          ten_truong: 'file_dau_thau',
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
      message: 'Thêm danh sách đấu thầu thành công',
      data: {
        ...danhSach,
        file_dau_thau: fileInfo,
      },
    };
  }

  /**
   * Lấy danh sách đấu thầu (kèm file info)
   * GET /api/dau-thau/:dauThauId/danh-sach
   */
  @Get()
  @RequirePermission('DAU_THAU', HanhDong.XEM)
  async layDanhSach(@Param('dauThauId', ParseIntPipe) dauThauId: number) {
    const danhSach = await this.danhSachDauThauService.layDanhSach(dauThauId);
    return {
      success: true,
      data: danhSach,
    };
  }

  /**
   * Cập nhật danh sách đấu thầu KÈM FILE (nếu có)
   * PATCH /api/dau-thau/:dauThauId/danh-sach/:id
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - nam: number (optional)
   * - kinh_phi: number (optional)
   * - hinh_thuc: string (optional)
   * - buoc: string (optional)
   * - trang_thai: string (optional)
   * - xoa_file: boolean (optional)
   * - file: binary (optional)
   */
  @Patch(':id')
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // 1. Cập nhật thông tin danh sách (nếu có)
    let danhSach = null;
    if (body.nam || body.kinh_phi || body.hinh_thuc || body.buoc || body.trang_thai) {
      const updateDto: UpdateDanhSachDauThauDto = {
        nam: body.nam ? parseInt(body.nam) : undefined,
        kinh_phi: body.kinh_phi ? parseFloat(body.kinh_phi) : undefined,
        hinh_thuc: body.hinh_thuc,
        buoc: body.buoc,
        trang_thai: body.trang_thai,
      };
      danhSach = await this.danhSachDauThauService.capNhat(id, updateDto, file?.originalname);
    } else {
      danhSach = await this.danhSachDauThauService.layTheoId(id);
    }

    // 2. Xóa file (nếu yêu cầu)
    if (body.xoa_file === 'true' || body.xoa_file === true) {
      try {
        await this.fileHeThongService.xoaFile({
          module: 'DAU_THAU',
          ban_ghi_id: id,
          ten_truong: 'file_dau_thau',
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
          module: 'DAU_THAU',
          ban_ghi_id: id,
          ten_truong: 'file_dau_thau',
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
      message: 'Cập nhật danh sách đấu thầu thành công',
      data: {
        ...danhSach,
        file_dau_thau: fileInfo,
      },
    };
  }

  /**
   * Xóa danh sách đấu thầu (bao gồm cả file)
   * DELETE /api/dau-thau/:dauThauId/danh-sach/:id
   */
  @Delete(':id')
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.danhSachDauThauService.xoa(id);
    return {
      success: true,
      message: 'Xóa danh sách đấu thầu thành công',
    };
  }
}
