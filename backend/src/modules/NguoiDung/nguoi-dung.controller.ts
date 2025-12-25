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
 * Controller xử lý các API liên quan đến Người Dùng
 * Base path: /api/nguoi-dung
 */
@Controller('nguoi-dung')
@UseGuards(JwtAuthGuard) // Áp dụng JWT guard cho tất cả các route
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  // ==================== AUTH APIs ====================

  /**
   * API: Đăng ký tài khoản mới
   * Method: POST /api/nguoi-dung/auth/register
   * Body: RegisterDto
   * Auth: Public
   */
  @Post('auth/register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return await this.nguoiDungService.register(registerDto);
  }

  /**
   * API: Đăng nhập
   * Method: POST /api/nguoi-dung/auth/login
   * Body: LoginDto
   * Auth: Public
   */
  @Post('auth/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return await this.nguoiDungService.login(loginDto);
  }

  /**
   * API: Lấy thông tin profile của user hiện tại
   * Method: GET /api/nguoi-dung/auth/profile
   * Auth: Required
   */
  @Get('auth/profile')
  async getProfile(@CurrentUser('id') userId: number) {
    return await this.nguoiDungService.getProfile(userId);
  }

  /**
   * API: Đổi mật khẩu
   * Method: POST /api/nguoi-dung/auth/change-password
   * Body: ChangePasswordDto
   * Auth: Required
   */
  @Post('auth/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('id') userId: number,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    return await this.nguoiDungService.changePassword(userId, changePasswordDto);
  }

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
