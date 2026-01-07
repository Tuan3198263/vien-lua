import { Module } from '@nestjs/common';
import { DanhMucController } from './danh-muc.controller';

/**
 * Module đơn giản cho danh mục
 * Không cần service, entity, database
 */
@Module({
  controllers: [DanhMucController],
})
export class DanhMucModule {}
