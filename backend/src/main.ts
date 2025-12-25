import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

/**
 * Entry point của ứng dụng NestJS
 * Khởi tạo server và lắng nghe trên port 3001
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Bật CORS để frontend có thể gọi API
  app.enableCors();
  
  // Prefix cho tất cả các route API
  app.setGlobalPrefix('api');

  // Bật validation pipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các field không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Throw error nếu có field không hợp lệ
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
    }),
  );
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  // Kiểm tra kết nối database
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('✅ Kết nối database thành công!');
    console.log(`📊 Database: ${dataSource.options.database}`);
  } else {
    console.log('❌ Kết nối database thất bại!');
  }
  
  console.log(`🚀 Backend đang chạy tại: http://localhost:${port}/api`);
}

bootstrap();
