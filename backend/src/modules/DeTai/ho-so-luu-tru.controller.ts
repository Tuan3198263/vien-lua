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
import { HoSoLuuTruService } from './ho-so-luu-tru.service';
import { CreateHoSoLuuTruDto, UpdateHoSoLuuTruDto } from './dto/de-tai.dto';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';
import { UploadFileDto } from '../FileHeThong/dto/file-he-thong.dto';

/**
 * Controller xử lý API cho Hồ Sơ Lưu Trữ
 * Upload file được tích hợp vào thêm/sửa hồ sơ (giống HopDong)
 */
@Controller('de-tai/:deTaiId/ho-so')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class HoSoLuuTruController {
  constructor(
    private readonly hoSoLuuTruService: HoSoLuuTruService,
    private readonly fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo hồ sơ mới KÈM FILE (nếu có)
   * POST /api/de-tai/:deTaiId/ho-so
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - loai_ho_so: string
   * - nam: number
   * - file: binary (optional)
   */
  @Post()
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async tao(
    @Param('deTaiId', ParseIntPipe) deTaiId: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // Validate data thủ công (vì multipart/form-data)
    if (!body.loai_ho_so || !body.nam) {
      throw new BadRequestException('Loại hồ sơ và năm không được để trống');
    }

    // 1. Tạo hồ sơ trước
    const createDto: CreateHoSoLuuTruDto = {
      loai_ho_so: body.loai_ho_so,
      nam: parseInt(body.nam),
    };
    const hoSo = await this.hoSoLuuTruService.tao(deTaiId, createDto, file?.originalname);

    // 2. Upload file (nếu có)
    let fileInfo = null;
    if (file) {
      try {
        const uploadDto: UploadFileDto = {
          module: 'DE_TAI',
          ban_ghi_id: hoSo.id,
          ten_truong: 'file_ho_so',
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
      message: 'Thêm hồ sơ lưu trữ thành công',
      data: {
        ...hoSo,
        file_ho_so: fileInfo,
      },
    };
  }

  /**
   * Lấy danh sách hồ sơ (kèm file info)
   * GET /api/de-tai/:deTaiId/ho-so
   */
  @Get()
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layDanhSach(@Param('deTaiId', ParseIntPipe) deTaiId: number) {
    const danhSach = await this.hoSoLuuTruService.layDanhSach(deTaiId);
    return {
      success: true,
      data: danhSach,
    };
  }

  /**
   * Cập nhật hồ sơ KÈM FILE (nếu có)
   * PATCH /api/de-tai/:deTaiId/ho-so/:id
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - loai_ho_so: string (optional)
   * - nam: number (optional)
   * - xoa_file: boolean (optional)
   * - file: binary (optional)
   */
  @Patch(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // 1. Cập nhật thông tin hồ sơ (nếu có)
    let hoSo = null;
    if (body.loai_ho_so || body.nam) {
      const updateDto: UpdateHoSoLuuTruDto = {
        loai_ho_so: body.loai_ho_so,
        nam: body.nam ? parseInt(body.nam) : undefined,
      };
      hoSo = await this.hoSoLuuTruService.capNhat(id, updateDto, file?.originalname);
    } else {
      hoSo = await this.hoSoLuuTruService.layTheoId(id);
    }

    // 2. Xóa file (nếu yêu cầu)
    if (body.xoa_file === 'true' || body.xoa_file === true) {
      try {
        await this.fileHeThongService.xoaFile({
          module: 'DE_TAI',
          ban_ghi_id: id,
          ten_truong: 'file_ho_so',
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
          module: 'DE_TAI',
          ban_ghi_id: id,
          ten_truong: 'file_ho_so',
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
      message: 'Cập nhật hồ sơ lưu trữ thành công',
      data: {
        ...hoSo,
        file_ho_so: fileInfo,
      },
    };
  }

  /**
   * Xóa hồ sơ (bao gồm cả file)
   * DELETE /api/de-tai/:deTaiId/ho-so/:id
   */
  @Delete(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.hoSoLuuTruService.xoa(id);
    return {
      success: true,
      message: 'Xóa hồ sơ lưu trữ thành công',
    };
  }
}
