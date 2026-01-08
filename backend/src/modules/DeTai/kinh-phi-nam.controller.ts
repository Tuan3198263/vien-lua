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
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { HanhDong } from '../../shared/constants/hanh-dong.enum';
import { KinhPhiNamService } from './kinh-phi-nam.service';
import { CreateKinhPhiNamDto, UpdateKinhPhiNamDto } from './dto/de-tai.dto';

@Controller('de-tai/:deTaiId/kinh-phi')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class KinhPhiNamController {
  constructor(private readonly kinhPhiNamService: KinhPhiNamService) {}

  @Post()
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async tao(
    @Param('deTaiId', ParseIntPipe) deTaiId: number,
    @Body() createDto: CreateKinhPhiNamDto,
  ) {
    const kinhPhi = await this.kinhPhiNamService.tao(deTaiId, createDto);
    return {
      success: true,
      message: 'Thêm kinh phí thành công',
      data: kinhPhi,
    };
  }

  @Get()
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layDanhSach(@Param('deTaiId', ParseIntPipe) deTaiId: number) {
    const danhSach = await this.kinhPhiNamService.layDanhSach(deTaiId);
    return {
      success: true,
      data: danhSach,
    };
  }

    // ✅ API LẤY CHI TIẾT KINH PHÍ THEO ID
  @Get(':id')
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layChiTiet(
    @Param('deTaiId', ParseIntPipe) deTaiId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const kinhPhi = await this.kinhPhiNamService.layTheoId(id);

    // đảm bảo kinh phí thuộc đúng đề tài
    if (kinhPhi.de_tai_id !== deTaiId) {
      throw new NotFoundException('Kinh phí không thuộc đề tài này');
    }

    return {
      success: true,
      data: kinhPhi,
    };
  }

  @Patch(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKinhPhiNamDto,
  ) {
    const kinhPhi = await this.kinhPhiNamService.capNhat(id, updateDto);
    return {
      success: true,
      message: 'Cập nhật kinh phí thành công',
      data: kinhPhi,
    };
  }

  @Delete(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.kinhPhiNamService.xoa(id);
    return {
      success: true,
      message: 'Xóa kinh phí thành công',
    };
  }
}
