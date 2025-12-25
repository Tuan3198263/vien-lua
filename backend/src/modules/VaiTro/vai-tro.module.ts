import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaiTroService } from './vai-tro.service';
import { VaiTroController } from './vai-tro.controller';
import { VaiTro } from './vai-tro.entity';

/**
 * Module Vai Trò
 * Quản lý các vai trò trong hệ thống
 */
@Module({
  imports: [
    // Import TypeORM repository cho entity VaiTro
    TypeOrmModule.forFeature([VaiTro]),
  ],
  controllers: [VaiTroController],
  providers: [VaiTroService],
  exports: [VaiTroService], // Export để các module khác có thể sử dụng
})
export class VaiTroModule {}
