import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { DauThau } from './entities/dau-thau.entity';
import { DanhSachDauThau } from './entities/danh-sach-dau-thau.entity';

// Services
import { DauThauService } from './dau-thau.service';
import { DanhSachDauThauService } from './danh-sach-dau-thau.service';

// Controllers
import { DauThauController } from './dau-thau.controller';
import { DanhSachDauThauController } from './danh-sach-dau-thau.controller';

// Modules
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';
import { FileHeThongModule } from '../FileHeThong/file-he-thong.module';

/**
 * Module Đấu Thầu
 * Quản lý thông tin đấu thầu của đề tài
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([DauThau, DanhSachDauThau]),
    PhanQuyenModule,
    FileHeThongModule,
  ],
  controllers: [DauThauController, DanhSachDauThauController],
  providers: [DauThauService, DanhSachDauThauService],
  exports: [DauThauService, DanhSachDauThauService],
})
export class DauThauModule {}
