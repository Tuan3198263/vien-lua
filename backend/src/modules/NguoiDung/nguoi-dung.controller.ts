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
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';

/**
 * Controller xử lý các API liên quan đến Người Dùng (CRUD)
 * Base path: /api/nguoi-dung
 * 
 * Note: Các API authentication đã được chuyển sang AuthController
 * với base path /api/auth
 */
@Controller('nguoi-dung')
@UseGuards(JwtAuthGuard, PermissionGuard) // Áp dụng JWT guard và Permission guard
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  // ==================== CRUD APIs ====================

  /**
   * API: Tạo người dùng mới (bởi admin)
   * Method: POST /api/nguoi-dung
   * Body: CreateNguoiDungDto
   * Auth: Required
   * Permission: Cần quyền THAO_TAC
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('NGUOI_DUNG', HanhDong.THAO_TAC)
  async create(@Body(ValidationPipe) createNguoiDungDto: CreateNguoiDungDto) {
    return await this.nguoiDungService.create(createNguoiDungDto);
  }

  /**
   * API: Lấy danh sách người dùng (có phân trang, filter)
   * Method: GET /api/nguoi-dung
   * Query params: page, limit, tai_khoan, ho_ten, email...
   * Auth: Required
   * Permission: Quyền XEM (mặc định)
   */
  @Get()
  @RequirePermission('NGUOI_DUNG', HanhDong.XEM)
  async findAll(@Query() queryParams: any) {
    // Manual transform page và limit thành number
    const paginationDto: PaginationDto = {
      page: queryParams.page ? parseInt(queryParams.page, 10) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
      ...queryParams,
    };
    
    return await this.nguoiDungService.findAll(paginationDto);
  }

  /**
   * API: Lấy một người dùng theo ID
   * Method: GET /api/nguoi-dung/:id
   * Params: id (number)
   * Auth: Required
   * Permission: Quyền XEM (mặc định)
   */
  @Get(':id')
  @RequirePermission('NGUOI_DUNG', HanhDong.XEM)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.nguoiDungService.findOne(id);
  }

  /**
   * API: Cập nhật người dùng
   * Method: PATCH /api/nguoi-dung/:id
   * Params: id (number)
   * Body: UpdateNguoiDungDto
   * Auth: Required
   * Permission: Cần quyền THAO_TAC
   */
  @Patch(':id')
  @RequirePermission('NGUOI_DUNG', HanhDong.THAO_TAC)
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
   * Permission: Cần quyền THAO_TAC
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('NGUOI_DUNG', HanhDong.THAO_TAC)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.nguoiDungService.remove(id);
  }

  /**
   * API: Xóa nhiều người dùng
   * Method: DELETE /api/nguoi-dung
   * Body: { ids: number[] }
   * Auth: Required
   * Permission: Cần quyền THAO_TAC
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @RequirePermission('NGUOI_DUNG', HanhDong.THAO_TAC)
  async removeMultiple(@Body('ids') ids: number[]) {
    return await this.nguoiDungService.removeMultiple(ids);
  }
}
