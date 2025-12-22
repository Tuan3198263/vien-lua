import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/user/user.entity';

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
      host: this.configService.get<string>('DB_HOST', 'sql.freedb.tech'),
      port: this.configService.get<number>('DB_PORT', 3306),
      username: this.configService.get<string>('DB_USER', 'freedb_tuanle2901'),
      password: this.configService.get<string>('DB_PASSWORD', '8KWDRXuY!AbwG%S'),
      database: this.configService.get<string>('DB_NAME', 'freedb_vien_lua'),
      
      // Import trực tiếp entities thay vì dùng pattern
      entities: [User],
      
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
