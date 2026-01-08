import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { SanPhamService } from './san-pham.service';
import { CreateSanPhamDto, UpdateSanPhamDto } from './dto/de-tai.dto';

@Controller('de-tai/:deTaiId/san-pham')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) {}

  @Post()
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async tao(
    @Param('deTaiId', ParseIntPipe) deTaiId: number,
    @Body() createDto: CreateSanPhamDto,
  ) {
    const sanPham = await this.sanPhamService.tao(deTaiId, createDto);
    return {
      success: true,
      message: 'Thêm sản phẩm thành công',
      data: sanPham,
    };
  }

  @Get()
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layDanhSach(@Param('deTaiId', ParseIntPipe) deTaiId: number) {
    const danhSach = await this.sanPhamService.layDanhSach(deTaiId);
    return {
      success: true,
      data: danhSach,
    };
  }

  @Patch(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSanPhamDto,
  ) {
    const sanPham = await this.sanPhamService.capNhat(id, updateDto);
    return {
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: sanPham,
    };
  }

  @Delete(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.sanPhamService.xoa(id);
    return {
      success: true,
      message: 'Xóa sản phẩm thành công',
    };
  }
}
