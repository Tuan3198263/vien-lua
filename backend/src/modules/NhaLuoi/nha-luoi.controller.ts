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
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { NhaLuoiService } from './nha-luoi.service';
import { CreateNhaLuoiDto, UpdateNhaLuoiDto, FilterNhaLuoiDto } from './dto/nha-luoi.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';

/**
 * Controller xử lý các API cho module Nhà Lưới
 * Base path: /api/nha-luoi
 */
@Controller('nha-luoi')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NhaLuoiController {
  constructor(private readonly nhaLuoiService: NhaLuoiService) {}

  /**
   * Tạo nhà lưới mới
   * POST /api/nha-luoi
   * 
   * @permission NHA_LUOI - THAO_TAC
   */
  @Post()
  @RequirePermission('NHA_LUOI', HanhDong.THAO_TAC)
  async tao(
    @Body(ValidationPipe) createNhaLuoiDto: CreateNhaLuoiDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.nhaLuoiService.tao(createNhaLuoiDto, user.id);
    return {
      success: true,
      data,
    };
  }

  /**
   * Lấy danh sách nhà lưới (có phân trang và filter)
   * GET /api/nha-luoi
   * 
   * Query params:
   * - page: số trang (mặc định 1)
   * - limit: số lượng/trang (mặc định 10)
   * - ten_nha_luoi: filter theo tên nhà lưới (LIKE)
   * - khu: filter theo khu (LIKE)
   * - so_be: filter theo số bể (exact)
   * - dien_tich: filter theo diện tích (exact)
   * 
   * @permission NHA_LUOI - XEM (mặc định)
   */
  @Get()
  @RequirePermission('NHA_LUOI', HanhDong.XEM)
  async layDanhSach(@Query(ValidationPipe) filterDto: FilterNhaLuoiDto) {
    const result = await this.nhaLuoiService.layDanhSach(filterDto);
    return {
      success: true,
      ...result,
    };
  }

  /**
   * Lấy chi tiết nhà lưới theo ID
   * GET /api/nha-luoi/:id
   * 
   * @permission NHA_LUOI - XEM (mặc định)
   */
  @Get(':id')
  @RequirePermission('NHA_LUOI', HanhDong.XEM)
  async layTheoId(@Param('id', ParseIntPipe) id: number) {
    const data = await this.nhaLuoiService.layTheoId(id);
    return {
      success: true,
      data,
    };
  }

  /**
   * Cập nhật nhà lưới
   * PATCH /api/nha-luoi/:id
   * 
   * @permission NHA_LUOI - THAO_TAC
   */
  @Patch(':id')
  @RequirePermission('NHA_LUOI', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateNhaLuoiDto: UpdateNhaLuoiDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.nhaLuoiService.capNhat(
      id,
      updateNhaLuoiDto,
      user.id,
    );
    return {
      success: true,
      data,
    };
  }

  /**
   * Xóa nhà lưới
   * DELETE /api/nha-luoi/:id
   * 
   * @permission NHA_LUOI - THAO_TAC
   */
  @Delete(':id')
  @RequirePermission('NHA_LUOI', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    const data = await this.nhaLuoiService.xoa(id);
    return {
      success: true,
      data,
    };
  }
}
