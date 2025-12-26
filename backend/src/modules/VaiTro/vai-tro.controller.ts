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
   * Permission: Cần quyền THEM trên module VAI_TRO
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('VAI_TRO', HanhDong.THEM)
  async create(@Body(ValidationPipe) createVaiTroDto: CreateVaiTroDto) {
    return await this.vaiTroService.create(createVaiTroDto);
  }

  /**
   * API: Lấy danh sách vai trò (có phân trang, tìm kiếm, sắp xếp)
   * Method: GET /api/vai-tro
   * Query params: page, limit, sort_field, sort_order, search
   * Auth: Public (có thể bỏ @Public() nếu muốn require auth)
   */
  @Get()
  @Public() // Cho phép truy cập không cần đăng nhập
  async findAll(@Query(ValidationPipe) paginationDto: PaginationDto) {
    return await this.vaiTroService.findAll(paginationDto);
  }

  /**
   * API: Lấy một vai trò theo ID
   * Method: GET /api/vai-tro/:id
   * Params: id (number)
   * Auth: Required
   * Permission: Cần quyền XEM_CHI_TIET trên module VAI_TRO
   */
  @Get(':id')
  @RequirePermission('VAI_TRO', HanhDong.XEM_CHI_TIET)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.vaiTroService.findOne(id);
  }

  /**
   * API: Cập nhật vai trò
   * Method: PATCH /api/vai-tro/:id
   * Params: id (number)
   * Body: UpdateVaiTroDto
   * Auth: Required
   * Permission: Cần quyền SUA trên module VAI_TRO
   */
  @Patch(':id')
  @RequirePermission('VAI_TRO', HanhDong.SUA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateVaiTroDto: UpdateVaiTroDto,
  ) {
    return await this.vaiTroService.update(id, updateVaiTroDto);
  }

  /**
   * API: Xóa một vai trò
   * Method: DELETE /api/vai-tro/:id
   * Params: id (number)
   * Auth: Required
   * Permission: Cần quyền XOA trên module VAI_TRO
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('VAI_TRO', HanhDong.XOA)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.vaiTroService.remove(id);
  }

  /**
   * API: Xóa nhiều vai trò
   * Method: DELETE /api/vai-tro
   * Body: { ids: number[] }
   * Auth: Required
   * Permission: Cần quyền XOA trên module VAI_TRO
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @RequirePermission('VAI_TRO', HanhDong.XOA)
  async removeMultiple(@Body('ids') ids: number[]) {
    return await this.vaiTroService.removeMultiple(ids);
  }
}
