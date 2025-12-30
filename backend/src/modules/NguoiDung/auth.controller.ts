import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { ChangePasswordDto } from './dto/nguoi-dung.dto';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Controller xử lý các API liên quan đến Authentication
 * Base path: /api/auth
 */
@Controller('auth')
@UseGuards(JwtAuthGuard) // Áp dụng JWT guard cho tất cả các route
export class AuthController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  /**
   * API: Đăng ký tài khoản mới
   * Method: POST /api/auth/register
   * Body: RegisterDto
   * Auth: Public
   */
  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return await this.nguoiDungService.register(registerDto);
  }

  /**
   * API: Đăng nhập
   * Method: POST /api/auth/login
   * Body: LoginDto
   * Auth: Public
   */
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return await this.nguoiDungService.login(loginDto);
  }

  /**
   * API: Đăng xuất
   * Method: POST /api/auth/logout
   * Auth: Required
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('id') userId: number) {
    return await this.nguoiDungService.logout(userId);
  }

  /**
   * API: Lấy thông tin profile của user hiện tại
   * Method: GET /api/auth/profile
   * Auth: Required
   */
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: number) {
    return await this.nguoiDungService.getProfile(userId);
  }

  /**
   * API: Đổi mật khẩu
   * Method: POST /api/auth/change-password
   * Body: ChangePasswordDto
   * Auth: Required
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('id') userId: number,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    return await this.nguoiDungService.changePassword(userId, changePasswordDto);
  }
}
