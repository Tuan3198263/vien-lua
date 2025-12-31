import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhanQuyenService } from './phan-quyen.service';
import { PhanQuyenController } from './phan-quyen.controller';
import { PhanQuyen } from './phan-quyen.entity';

/**
 * Module Phân Quyền
 * Quản lý phân quyền cho các vai trò
 */
@Module({
  imports: [TypeOrmModule.forFeature([PhanQuyen])],
  controllers: [PhanQuyenController],
  providers: [PhanQuyenService],
  exports: [PhanQuyenService],
})
export class PhanQuyenModule {}
