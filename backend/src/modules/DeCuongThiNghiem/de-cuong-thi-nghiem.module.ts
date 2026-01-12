import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { DeCuongThiNghiem } from './entities/de-cuong-thi-nghiem.entity';
import { DanhSachSoLuongThiNghiem } from './entities/danh-sach-so-luong-thi-nghiem.entity';

// Services
import { DeCuongThiNghiemService } from './de-cuong-thi-nghiem.service';
import { DanhSachSoLuongThiNghiemService } from './danh-sach-so-luong-thi-nghiem.service';

// Controllers
import { DeCuongThiNghiemController } from './de-cuong-thi-nghiem.controller';
import { DanhSachSoLuongThiNghiemController } from './danh-sach-so-luong-thi-nghiem.controller';

// Modules
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';
import { FileHeThongModule } from '../FileHeThong/file-he-thong.module';

/**
 * Module Đề Cương Thí Nghiệm
 * Quản lý thông tin đề cương thí nghiệm của đề tài
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([DeCuongThiNghiem, DanhSachSoLuongThiNghiem]),
    PhanQuyenModule,
    FileHeThongModule,
  ],
  controllers: [DeCuongThiNghiemController, DanhSachSoLuongThiNghiemController],
  providers: [DeCuongThiNghiemService, DanhSachSoLuongThiNghiemService],
  exports: [DeCuongThiNghiemService, DanhSachSoLuongThiNghiemService],
})
export class DeCuongThiNghiemModule {}
