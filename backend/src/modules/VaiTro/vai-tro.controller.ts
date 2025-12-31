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
import { VaiTroService } from './vai-tro.service';
import { CreateVaiTroDto, UpdateVaiTroDto } from './dto/vai-tro.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';

/**
 * Controller xử lý các API liên quan đến Vai Trò
 * Base path: /api/vai-tro
 */
@Controller('vai-tro')
@UseGuards(JwtAuthGuard, PermissionGuard) // Áp dụng JWT guard và Permission guard
export class VaiTroController {
  constructor(private readonly vaiTroService: VaiTroService) {}

  /**
   * API: Tạo vai trò mới
   * Method: POST /api/vai-tro
   * Body: CreateVaiTroDto
   * Auth: Required
   * Permission: Cần quyền THAO_TAC trên module VAI_TRO
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('VAI_TRO', HanhDong.THAO_TAC)
  async create(@Body(ValidationPipe) createVaiTroDto: CreateVaiTroDto) {
    const data = await this.vaiTroService.create(createVaiTroDto);
    return {
      success: true,
      data,
    };
  }

  /**
   * API: Lấy danh sách vai trò (có phân trang, tìm kiếm)
   * Method: GET /api/vai-tro
   * Query params: page, limit, ma_vai_tro, ten_vai_tro...
   * Auth: Public (có thể bỏ @Public() nếu muốn require auth)
   */
  @Get()
  @Public() // Cho phép truy cập không cần đăng nhập
  async findAll(@Query() queryParams: any) {
    // Manual transform page và limit thành number
    const paginationDto: PaginationDto = {
      page: queryParams.page ? parseInt(queryParams.page, 10) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
      ...queryParams,
    };
    
    return await this.vaiTroService.findAll(paginationDto);
  }

  /**
   * API: Lấy một vai trò theo ID
   * Method: GET /api/vai-tro/:id
   * Params: id (number)
   * Auth: Required
   * Permission: Quyền XEM (mặc định)
   */
  @Get(':id')
  @RequirePermission('VAI_TRO', HanhDong.XEM)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.vaiTroService.findOne(id);
    return {
      success: true,
      data,
    };
  }

  /**
   * API: Cập nhật vai trò
   * Method: PATCH /api/vai-tro/:id
   * Params: id (number)
   * Body: UpdateVaiTroDto
   * Auth: Required
   * Permission: Cần quyền THAO_TAC trên module VAI_TRO
   */
  @Patch(':id')
  @RequirePermission('VAI_TRO', HanhDong.THAO_TAC)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateVaiTroDto: UpdateVaiTroDto,
  ) {
    const data = await this.vaiTroService.update(id, updateVaiTroDto);
    return {
      success: true,
      data,
    };
  }

  /**
   * API: Xóa một vai trò
   * Method: DELETE /api/vai-tro/:id
   * Params: id (number)
   * Auth: Required
   * Permission: Cần quyền THAO_TAC trên module VAI_TRO
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('VAI_TRO', HanhDong.THAO_TAC)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.vaiTroService.remove(id);
    return {
      success: true,
      data,
    };
  }

  /**
   * API: Xóa nhiều vai trò
   * Method: DELETE /api/vai-tro
   * Body: { ids: number[] }
   * Auth: Required
   * Permission: Cần quyền THAO_TAC trên module VAI_TRO
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @RequirePermission('VAI_TRO', HanhDong.THAO_TAC)
  async removeMultiple(@Body('ids') ids: number[]) {
    const data = await this.vaiTroService.removeMultiple(ids);
    return {
      success: true,
      data,
    };
  }
}
