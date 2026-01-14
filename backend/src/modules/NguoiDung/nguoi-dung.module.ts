import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

import { NguoiDungService } from './nguoi-dung.service';
import { NguoiDungController } from './nguoi-dung.controller';
import { AuthController } from './auth.controller';
import { NguoiDung } from './nguoi-dung.entity';
import { VaiTroModule } from '../VaiTro/vai-tro.module';
import { PhanQuyenModule } from '../PhanQuyen/phan-quyen.module';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

/**
 * Module Người Dùng
 * Quản lý người dùng và authentication
 */
@Module({
  imports: [
    // Import TypeORM repository cho entity NguoiDung
    TypeOrmModule.forFeature([NguoiDung]),

    // Import VaiTroModule để sử dụng VaiTroService
    VaiTroModule,

    // Import PhanQuyenModule để sử dụng PermissionGuard
    forwardRef(() => PhanQuyenModule),

    // Passport Module
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT Module (load secret + expiration từ .env)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // Secret ký JWT
        secret:
          configService.get<string>('JWT_SECRET') ??
          'vien-lua-secret-key-2024',

        // Thời gian hết hạn token
        signOptions: {
          // StringValue đến từ package "ms" (ví dụ: 1d | 24h | 30m)
          expiresIn:
            (configService.get<string>('JWT_EXPIRATION') ??
              '24h') as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NguoiDungController, AuthController],
  providers: [NguoiDungService, JwtStrategy],
  exports: [NguoiDungService, JwtStrategy, PassportModule],
})
export class NguoiDungModule {}
