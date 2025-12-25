import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NguoiDungService } from './nguoi-dung.service';
import { NguoiDungController } from './nguoi-dung.controller';
import { NguoiDung } from './nguoi-dung.entity';
import { VaiTroModule } from '../VaiTro/vai-tro.module';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { JWT_EXPIRATION } from '../../shared/constants/app.constants';

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

    // Passport Module
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT Module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'vien-lua-secret-key-2024',
        signOptions: {
          expiresIn: JWT_EXPIRATION,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NguoiDungController],
  providers: [NguoiDungService, JwtStrategy],
  exports: [NguoiDungService, JwtStrategy, PassportModule],
})
export class NguoiDungModule {}
