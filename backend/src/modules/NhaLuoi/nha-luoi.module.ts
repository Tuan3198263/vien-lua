import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NhaLuoi } from './nha-luoi.entity';
import { NhaLuoiController } from './nha-luoi.controller';
import { NhaLuoiService } from './nha-luoi.service';
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';

/**
 * Module Nhà Lưới
 * Quản lý thông tin nhà lưới trong hệ thống
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([NhaLuoi]),
    PhanQuyenModule, // Import để sử dụng PermissionGuard
  ],
  controllers: [NhaLuoiController],
  providers: [NhaLuoiService],
  exports: [NhaLuoiService],
})
export class NhaLuoiModule {}
