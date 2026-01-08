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
import { SanPhamThucTeService } from './san-pham-thuc-te.service';
import { CreateSanPhamThucTeDto, UpdateSanPhamThucTeDto } from './dto/de-tai.dto';

@Controller('de-tai/:deTaiId/san-pham-thuc-te')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class SanPhamThucTeController {
  constructor(private readonly sanPhamThucTeService: SanPhamThucTeService) {}

  @Post()
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async tao(
    @Param('deTaiId', ParseIntPipe) deTaiId: number,
    @Body() createDto: CreateSanPhamThucTeDto,
  ) {
    const sanPham = await this.sanPhamThucTeService.tao(deTaiId, createDto);
    return {
      success: true,
      message: 'Thêm sản phẩm thực tế thành công',
      data: sanPham,
    };
  }

  @Get()
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layDanhSach(@Param('deTaiId', ParseIntPipe) deTaiId: number) {
    const danhSach = await this.sanPhamThucTeService.layDanhSach(deTaiId);
    return {
      success: true,
      data: danhSach,
    };
  }

  @Patch(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSanPhamThucTeDto,
  ) {
    const sanPham = await this.sanPhamThucTeService.capNhat(id, updateDto);
    return {
      success: true,
      message: 'Cập nhật sản phẩm thực tế thành công',
      data: sanPham,
    };
  }

  @Delete(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.sanPhamThucTeService.xoa(id);
    return {
      success: true,
      message: 'Xóa sản phẩm thực tế thành công',
    };
  }
}
