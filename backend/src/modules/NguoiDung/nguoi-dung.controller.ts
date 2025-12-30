import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import {
  CreateNguoiDungDto,
  UpdateNguoiDungDto,
  ChangePasswordDto,
} from './dto/nguoi-dung.dto';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Controller xử lý các API liên quan đến Người Dùng (CRUD)
 * Base path: /api/nguoi-dung
 * 
 * Note: Các API authentication đã được chuyển sang AuthController
 * với base path /api/auth
 */
@Controller('nguoi-dung')
@UseGuards(JwtAuthGuard) // Áp dụng JWT guard cho tất cả các route
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  // ==================== CRUD APIs ====================

  /**
   * API: Tạo người dùng mới (bởi admin)
   * Method: POST /api/nguoi-dung
   * Body: CreateNguoiDungDto
   * Auth: Required
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createNguoiDungDto: CreateNguoiDungDto) {
    return await this.nguoiDungService.create(createNguoiDungDto);
  }

  /**
   * API: Lấy danh sách người dùng (có phân trang, tìm kiếm, sắp xếp)
   * Method: GET /api/nguoi-dung
   * Query params: page, limit, sort_field, sort_order, search
   * Auth: Required
   */
  @Get()
  async findAll(@Query(ValidationPipe) paginationDto: PaginationDto) {
    return await this.nguoiDungService.findAll(paginationDto);
  }

  /**
   * API: Lấy một người dùng theo ID
   * Method: GET /api/nguoi-dung/:id
   * Params: id (number)
   * Auth: Required
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.nguoiDungService.findOne(id);
  }

  /**
   * API: Cập nhật người dùng
   * Method: PATCH /api/nguoi-dung/:id
   * Params: id (number)
   * Body: UpdateNguoiDungDto
   * Auth: Required
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateNguoiDungDto: UpdateNguoiDungDto,
  ) {
    return await this.nguoiDungService.update(id, updateNguoiDungDto);
  }

  /**
   * API: Xóa một người dùng
   * Method: DELETE /api/nguoi-dung/:id
   * Params: id (number)
   * Auth: Required
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.nguoiDungService.remove(id);
  }

  /**
   * API: Xóa nhiều người dùng
   * Method: DELETE /api/nguoi-dung
   * Body: { ids: number[] }
   * Auth: Required
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeMultiple(@Body('ids') ids: number[]) {
    return await this.nguoiDungService.removeMultiple(ids);
  }
}
