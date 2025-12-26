import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaiTroService } from './vai-tro.service';
import { VaiTroController } from './vai-tro.controller';
import { VaiTro } from './vai-tro.entity';
import { PhanQuyen } from '../PhanQuyen/phan-quyen.entity';
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';

/**
 * Module Vai Trò
 * Quản lý các vai trò trong hệ thống
 */
@Module({
  imports: [
    // Import TypeORM repository cho entity VaiTro và PhanQuyen
    TypeOrmModule.forFeature([VaiTro, PhanQuyen]),
    // Import PhanQuyenModule để sử dụng PermissionGuard
    forwardRef(() => PhanQuyenModule),
  ],
  controllers: [VaiTroController],
  providers: [VaiTroService],
  exports: [VaiTroService], // Export để các module khác có thể sử dụng
})
export class VaiTroModule {}
