import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { DauThauService } from './dau-thau.service';
import { CreateDauThauDto, UpdateDauThauDto, FilterDauThauDto } from './dto/dau-thau.dto';

/**
 * Controller xử lý API cho Đấu Thầu
 */
@Controller('dau-thau')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DauThauController {
  constructor(private readonly dauThauService: DauThauService) {}

  /**
   * Tạo đấu thầu mới
   * POST /api/dau-thau
   */
  @Post()
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  async tao(@Body() createDauThauDto: CreateDauThauDto, @CurrentUser() user: any) {
    const dauThau = await this.dauThauService.tao(createDauThauDto, user.id);
    return {
      success: true,
      message: 'Tạo đấu thầu thành công',
      data: dauThau,
    };
  }

  /**
   * Lấy danh sách đấu thầu có phân trang và filter
   * GET /api/dau-thau
   */
  @Get()
  @RequirePermission('DAU_THAU', HanhDong.XEM)
  async layDanhSach(@Query() filterDto: FilterDauThauDto) {
    return this.dauThauService.layDanhSach(filterDto);
  }

  /**
   * Lấy chi tiết đấu thầu
   * GET /api/dau-thau/:id
   */
  @Get(':id')
  @RequirePermission('DAU_THAU', HanhDong.XEM)
  async layTheoId(@Param('id', ParseIntPipe) id: number) {
    const dauThau = await this.dauThauService.layTheoId(id);
    return {
      success: true,
      data: dauThau,
    };
  }

  /**
   * Cập nhật đấu thầu
   * PATCH /api/dau-thau/:id
   */
  @Patch(':id')
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDauThauDto: UpdateDauThauDto,
    @CurrentUser() user: any,
  ) {
    const dauThau = await this.dauThauService.capNhat(id, updateDauThauDto, user.id);
    return {
      success: true,
      message: 'Cập nhật đấu thầu thành công',
      data: dauThau,
    };
  }

  /**
   * Xóa đấu thầu (cascade xóa các con)
   * DELETE /api/dau-thau/:id
   */
  @Delete(':id')
  @RequirePermission('DAU_THAU', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.dauThauService.xoa(id);
    return {
      success: true,
      message: 'Xóa đấu thầu thành công',
    };
  }
}
