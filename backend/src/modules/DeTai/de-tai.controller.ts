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
import { DeTaiService } from './de-tai.service';
import { CreateDeTaiDto, UpdateDeTaiDto, FilterDeTaiDto } from './dto/de-tai.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

@Controller('de-tai')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DeTaiController {
  constructor(private readonly deTaiService: DeTaiService) {}

  @Post()
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async tao(@Body() createDeTaiDto: CreateDeTaiDto, @CurrentUser() user: any) {
    const deTai = await this.deTaiService.tao(createDeTaiDto, user.id);
    return {
      success: true,
      message: 'Tạo đề tài thành công',
      data: deTai,
    };
  }

  @Get()
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layDanhSach(@Query() paginationDto: PaginationDto) {
    return this.deTaiService.layDanhSach(paginationDto);
  }

  @Get(':id')
  @RequirePermission('DE_TAI', HanhDong.XEM)
  async layTheoId(@Param('id', ParseIntPipe) id: number) {
    const deTai = await this.deTaiService.layTheoId(id);
    return {
      success: true,
      data: deTai,
    };
  }

  @Patch(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async capNhat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeTaiDto: UpdateDeTaiDto,
    @CurrentUser() user: any,
  ) {
    const deTai = await this.deTaiService.capNhat(id, updateDeTaiDto, user.id);
    return {
      success: true,
      message: 'Cập nhật đề tài thành công',
      data: deTai,
    };
  }

  @Delete(':id')
  @RequirePermission('DE_TAI', HanhDong.THAO_TAC)
  async xoa(@Param('id', ParseIntPipe) id: number) {
    await this.deTaiService.xoa(id);
    return {
      success: true,
      message: 'Xóa đề tài thành công',
    };
  }
}
