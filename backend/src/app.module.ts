import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/database.config';
import { VaiTroModule } from './modules/VaiTro/vai-tro.module';
import { NguoiDungModule } from './modules/NguoiDung/nguoi-dung.module';
import { PhanQuyenModule } from './modules/PhanQuyen/phan-quyen.module';
import { FileHeThongModule } from './modules/FileHeThong/file-he-thong.module';
import { HopDongModule } from './modules/HopDong/hop-dong.module';

/**
 * Module chính của ứng dụng
 * - Import ConfigModule để quản lý biến môi trường
 * - Import TypeOrmModule để kết nối database
 * - Import các feature modules
 */
@Module({
  imports: [
    // Config Module - Quản lý biến môi trường
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // TypeORM Module - Kết nối database
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    
    // Feature Modules
    VaiTroModule,
    NguoiDungModule,
    PhanQuyenModule,
    FileHeThongModule,
    HopDongModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
