import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';

/**
 * Module chính của ứng dụng
 * - Import ConfigModule để quản lý biến môi trường
 * - Import TypeOrmModule để kết nối database
 * - Import các feature modules (UserModule)
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
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
