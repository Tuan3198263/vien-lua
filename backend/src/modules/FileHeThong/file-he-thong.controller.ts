import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileHeThongService } from './file-he-thong.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import {
  UploadFileDto,
  GetFileDto,
  DeleteFileDto,
} from './dto/file-he-thong.dto';

/**
 * Controller xử lý các API liên quan đến File Hệ Thống
 * Base path: /api/file-he-thong
 * 
 * Note: Module này chủ yếu được gọi từ các module khác
 * Chỉ yêu cầu JWT authentication, không check permission cụ thể
 * Permission sẽ được check ở module gọi (HopDong, NhanVien...)
 */
@Controller('file-he-thong')
@UseGuards(JwtAuthGuard) // Chỉ yêu cầu JWT, không check permission
export class FileHeThongController {
  constructor(private readonly fileHeThongService: FileHeThongService) {}

  /**
   * API: Upload file lên S3
   * Method: POST /api/file-he-thong/upload
   * Body: multipart/form-data
   *   - file: File
   *   - module: string
   *   - ban_ghi_id: number
   *   - ten_truong: string
   * Auth: Required
   * 
   * Note: API này thường được gọi từ các module khác
   * khi thêm/sửa bản ghi có trường file
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 4 * 1024 * 1024, // 4MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('module') module: string,
    @Body('ban_ghi_id', ParseIntPipe) ban_ghi_id: number,
    @Body('ten_truong') ten_truong: string,
    @CurrentUser() user: any,
  ) {
    const uploadDto: UploadFileDto = {
      module,
      ban_ghi_id,
      ten_truong,
    };

    const data = await this.fileHeThongService.uploadFile(
      file,
      uploadDto,
      user.id,
    );

    return {
      success: true,
      message: 'Upload file thành công',
      data,
    };
  }

  /**
   * API: Lấy file theo module/ban_ghi_id/ten_truong
   * Method: GET /api/file-he-thong/lay-file
   * Query: module, ban_ghi_id, ten_truong
   * Auth: Required
   * 
   * Note: API này được dùng khi xem chi tiết bản ghi
   */
  @Get('lay-file')
  async layFile(@Query() getFileDto: GetFileDto) {
    const data = await this.fileHeThongService.layFile(getFileDto);

    return {
      success: true,
      data,
    };
  }

  /**
   * API: Lấy file theo ID
   * Method: GET /api/file-he-thong/:id
   * Params: id
   * Auth: Required
   */
  @Get(':id')
  async layFileTheoId(@Param('id', ParseIntPipe) id: number) {
    const data = await this.fileHeThongService.layFileTheoId(id);

    return {
      success: true,
      data,
    };
  }

  /**
   * API: Lấy danh sách file
   * Method: GET /api/file-he-thong
   * Query: page, limit, module, loai_file...
   * Auth: Required (JWT only)
   * 
   * Note: API này dành cho admin xem tổng quan file hệ thống
   * hoặc được gọi từ các module khác
   */
  @Get()
  async findAll(@Query() queryParams: any) {
    const paginationDto: PaginationDto = {
      page: queryParams.page ? parseInt(queryParams.page, 10) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
      ...queryParams,
    };

    return await this.fileHeThongService.findAll(paginationDto);
  }

  /**
   * API: Xóa file
   * Method: DELETE /api/file-he-thong/xoa
   * Query: module, ban_ghi_id, ten_truong
   * Auth: Required
   * 
   * Note: API này được gọi khi user xóa file trong form edit
   */
  @Delete('xoa')
  @HttpCode(HttpStatus.OK)
  async xoaFile(@Query() deleteFileDto: DeleteFileDto) {
    await this.fileHeThongService.xoaFile(deleteFileDto);

    return {
      success: true,
      message: 'Xóa file thành công',
    };
  }

  /**
   * API: Xóa file theo ID
   * Method: DELETE /api/file-he-thong/:id
   * Params: id
   * Auth: Required (JWT only)
   * 
   * Note: Được gọi từ các module khác hoặc admin
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async xoaFileTheoId(@Param('id', ParseIntPipe) id: number) {
    // Lấy thông tin file
    const file = await this.fileHeThongService.layFileTheoId(id);

    // Xóa file
    await this.fileHeThongService.xoaFile({
      module: file.module,
      ban_ghi_id: file.ban_ghi_id,
      ten_truong: file.ten_truong,
    });

    return {
      success: true,
      message: 'Xóa file thành công',
    };
  }
}
