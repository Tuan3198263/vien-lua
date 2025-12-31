import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HopDongService } from './hop-dong.service';
import { HopDongController } from './hop-dong.controller';
import { HopDong } from './hop-dong.entity';
import { FileHeThongModule } from '../FileHeThong/file-he-thong.module';
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';

/**
 * Module Hợp Đồng
 * Quản lý các hợp đồng trong hệ thống
 * Tích hợp với FileHeThong để quản lý file hợp đồng
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([HopDong]),
    FileHeThongModule, // Import để sử dụng FileHeThongService
    PhanQuyenModule,   // Import để sử dụng PermissionGuard
  ],
  controllers: [HopDongController],
  providers: [HopDongService],
  exports: [HopDongService],
})
export class HopDongModule {}
