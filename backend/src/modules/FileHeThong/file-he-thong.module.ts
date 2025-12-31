import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileHeThongController } from './file-he-thong.controller';
import { FileHeThongService } from './file-he-thong.service';
import { FileHeThong } from './file-he-thong.entity';
import { S3Config } from '../../config/s3.config';
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';

/**
 * Module quản lý File Hệ Thống
 * - Upload/xóa file trên AWS S3
 * - Quản lý metadata file trong database
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([FileHeThong]) // Import để PermissionGuard có thể sử dụng PhanQuyenService
  ],
  controllers: [FileHeThongController],
  providers: [FileHeThongService, S3Config],
  exports: [FileHeThongService], // Export để các module khác sử dụng
})
export class FileHeThongModule {}
