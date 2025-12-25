import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { VaiTro } from '../modules/VaiTro/vai-tro.entity';
import { NguoiDung } from '../modules/NguoiDung/nguoi-dung.entity';

/**
 * Cấu hình kết nối database
 * Sử dụng TypeORM để kết nối MySQL
 */
@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      
      // Import trực tiếp tất cả entities
      entities: [VaiTro, NguoiDung],
      
      // Chỉ bật synchronize trong development
      // KHÔNG bật trong production
      synchronize: this.configService.get<string>('NODE_ENV') !== 'production',
      
      // Tắt logging để giảm log query
      logging: false,
      
      // Timezone
      timezone: '+07:00',
      
      // Connection pool
      extra: {
        connectionLimit: 10,
      },
    };
  }
}
