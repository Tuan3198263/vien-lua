import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NhaLuoi } from './nha-luoi.entity';
import { LanSuDung } from './entities/lan-su-dung.entity';
import { DeCuongThiNghiem } from '../DeCuongThiNghiem/entities/de-cuong-thi-nghiem.entity';
import { NhaLuoiController } from './nha-luoi.controller';
import { NhaLuoiService } from './nha-luoi.service';
import { LanSuDungController } from './lan-su-dung.controller';
import { LanSuDungService } from './lan-su-dung.service';
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';
import { FileHeThongModule } from '../FileHeThong/file-he-thong.module';

/**
 * Module Nhà Lưới
 * Quản lý thông tin nhà lưới và lịch sử sử dụng
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([NhaLuoi, LanSuDung, DeCuongThiNghiem]),
    PhanQuyenModule, // Import để sử dụng PermissionGuard
    FileHeThongModule, // Import để sử dụng FileHeThongService
  ],
  controllers: [NhaLuoiController, LanSuDungController],
  providers: [NhaLuoiService, LanSuDungService],
  exports: [NhaLuoiService, LanSuDungService],
})
export class NhaLuoiModule {}
