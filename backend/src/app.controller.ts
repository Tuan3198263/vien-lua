import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controller chính - Xử lý các route cơ bản
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   * GET /api
   */
  @Get()
  getHealthCheck(): object {
    return this.appService.getHealthCheck();
  }

  /**
   * Kiểm tra kết nối database
   * GET /api/database-check
   */
  @Get('database-check')
  async checkDatabase(): Promise<object> {
    return this.appService.checkDatabaseConnection();
  }
}
