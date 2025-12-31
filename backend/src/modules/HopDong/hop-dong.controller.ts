import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HopDongService } from './hop-dong.service';
import { CreateHopDongDto, UpdateHopDongDto, FilterHopDongDto } from './dto/hop-dong.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { FileHeThongService } from '../FileHeThong/file-he-thong.service';
import { UploadFileDto } from '../FileHeThong/dto/file-he-thong.dto';

/**
 * Controller xử lý các API cho module Hợp Đồng
 * Tất cả thao tác file đều được thực hiện thông qua các endpoint hợp đồng
 * Không có endpoint file riêng lẻ
 */
@Controller('hop-dong')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class HopDongController {
  constructor(
    private readonly hopDongService: HopDongService,
    private readonly fileHeThongService: FileHeThongService,
  ) {}

  /**
   * Tạo hợp đồng mới KÈM FILE (nếu có)
   * POST /api/hop-dong
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - so_hop_dong: string
   * - doi_tac: string
   * - ghi_chu: string (optional)
   * - file: binary (optional)
   */
  @Post()
  @RequirePermission('HOP_DONG', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async createWithFile(
    @Body() body: any, // Không dùng DTO vì multipart/form-data
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // Validate data thủ công
    if (!body.so_hop_dong || !body.doi_tac) {
      throw new BadRequestException('Số hợp đồng và đối tác không được để trống');
    }

    // 1. Tạo hợp đồng trước
    const createDto: CreateHopDongDto = {
      so_hop_dong: body.so_hop_dong,
      doi_tac: body.doi_tac,
      ghi_chu: body.ghi_chu,
    };
    const hopDong = await this.hopDongService.create(createDto, user.id);

    // 2. Upload file (nếu có)
    let fileInfo = null;
    if (file) {
      try {
        const uploadDto: UploadFileDto = {
          module: 'HOP_DONG',
          ban_ghi_id: hopDong.id,
          ten_truong: 'file_hop_dong',
        };
        fileInfo = await this.fileHeThongService.uploadFile(
          file,
          uploadDto,
          user.id,
        );
      } catch (error) {
        console.error('Lỗi upload file:', error);
        // Không throw error, vẫn trả về hợp đồng đã tạo
      }
    }

    return {
      success: true,
      data: {
        ...hopDong,
        file_hop_dong: fileInfo,
      },
    };
  }

  /**
   * Lấy danh sách hợp đồng (có phân trang và filter)
   * GET /api/hop-dong
   */
  @Get()
  @RequirePermission('HOP_DONG', HanhDong.XEM)
  async findAll(@Query() filterDto: FilterHopDongDto) {
    const result = await this.hopDongService.findAll(filterDto);
    return {
      success: true,
      ...result,
    };
  }

  /**
   * Lấy thông tin chi tiết hợp đồng theo ID
   * GET /api/hop-dong/:id
   */
  @Get(':id')
  @RequirePermission('HOP_DONG', HanhDong.XEM)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.hopDongService.findOneWithFile(id);
    return {
      success: true,
      data,
    };
  }

  /**
   * Cập nhật hợp đồng KÈM FILE (nếu có)
   * PATCH /api/hop-dong/:id
   * Content-Type: multipart/form-data
   * 
   * Form fields:
   * - so_hop_dong: string (optional)
   * - doi_tac: string (optional)
   * - ghi_chu: string (optional)
   * - file: binary (optional)
   * - xoa_file: boolean (optional, true = xóa file hiện tại)
   */
  @Patch(':id')
  @RequirePermission('HOP_DONG', HanhDong.THAO_TAC)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // 1. Cập nhật thông tin hợp đồng (nếu có)
    let hopDong = null;
    if (body.so_hop_dong || body.doi_tac || body.ghi_chu) {
      const updateDto: UpdateHopDongDto = {
        so_hop_dong: body.so_hop_dong,
        doi_tac: body.doi_tac,
        ghi_chu: body.ghi_chu,
      };
      hopDong = await this.hopDongService.update(id, updateDto, user.id);
    } else {
      hopDong = await this.hopDongService.findOne(id);
    }

    // 2. Xóa file (nếu yêu cầu)
    if (body.xoa_file === 'true' || body.xoa_file === true) {
      try {
        await this.fileHeThongService.xoaFile({
          module: 'HOP_DONG',
          ban_ghi_id: id,
          ten_truong: 'file_hop_dong',
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
          module: 'HOP_DONG',
          ban_ghi_id: id,
          ten_truong: 'file_hop_dong',
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
      data: {
        ...hopDong,
        file_hop_dong: fileInfo,
      },
    };
  }

  /**
   * Xóa hợp đồng (bao gồm cả file nếu có)
   * DELETE /api/hop-dong/:id
   */
  @Delete(':id')
  @RequirePermission('HOP_DONG', HanhDong.THAO_TAC)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.hopDongService.remove(id);
    return {
      success: true,
      data,
    };
  }
}
