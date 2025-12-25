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
import { Public } from '../../common/decorators/public.decorator';

/**
 * Controller xử lý các API liên quan đến Vai Trò
 * Base path: /api/vai-tro
 */
@Controller('vai-tro')
@UseGuards(JwtAuthGuard) // Áp dụng JWT guard cho tất cả các route
export class VaiTroController {
  constructor(private readonly vaiTroService: VaiTroService) {}

  /**
   * API: Tạo vai trò mới
   * Method: POST /api/vai-tro
   * Body: CreateVaiTroDto
   * Auth: Required
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
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
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.vaiTroService.findOne(id);
  }

  /**
   * API: Cập nhật vai trò
   * Method: PATCH /api/vai-tro/:id
   * Params: id (number)
   * Body: UpdateVaiTroDto
   * Auth: Required
   */
  @Patch(':id')
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
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.vaiTroService.remove(id);
  }

  /**
   * API: Xóa nhiều vai trò
   * Method: DELETE /api/vai-tro
   * Body: { ids: number[] }
   * Auth: Required
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeMultiple(@Body('ids') ids: number[]) {
    return await this.vaiTroService.removeMultiple(ids);
  }
}
