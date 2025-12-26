import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhanQuyenService } from './phan-quyen.service';
import { PhanQuyenController } from './phan-quyen.controller';
import { PhanQuyen } from './phan-quyen.entity';
import { VaiTroModule } from '../VaiTro/vai-tro.module';

/**
 * Module Phân Quyền
 * Quản lý phân quyền cho các vai trò
 * NOTE: Module không còn cần thiết, danh sách module lấy từ constants
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([PhanQuyen]),
    forwardRef(() => VaiTroModule),
  ],
  controllers: [PhanQuyenController],
  providers: [PhanQuyenService],
  exports: [PhanQuyenService],
})
export class PhanQuyenModule {}
