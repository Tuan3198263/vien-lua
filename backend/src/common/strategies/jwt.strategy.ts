import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy
 * Xử lý việc validate JWT token
 * Trích xuất thông tin user từ payload của token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Trích xuất JWT từ header Authorization dạng Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Không cho phép token hết hạn
      ignoreExpiration: false,
      // Secret key để verify token (lấy từ biến môi trường)
      secretOrKey: configService.get<string>('JWT_SECRET') || 'vien-lua-secret-key-2024',
    });
  }

  /**
   * Hàm validate được gọi sau khi token được verify thành công
   * Payload chứa thông tin đã được encode trong token
   * Trả về user object sẽ được gán vào request.user
   */
  async validate(payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // Trả về thông tin user từ payload
    return {
      id: payload.sub,
      tai_khoan: payload.tai_khoan,
      vai_tro: payload.vai_tro,
    };
  }
}
