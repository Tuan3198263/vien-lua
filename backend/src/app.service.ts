import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Service chính - Logic nghiệp vụ cơ bản
 */
@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Health check - Kiểm tra server đang hoạt động
   */
  getHealthCheck(): object {
    return {
      status: 'OK',
      message: 'Backend API đang hoạt động',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Kiểm tra kết nối database
   * Test query đơn giản để verify connection
   */
  async checkDatabaseConnection(): Promise<object> {
    try {
      // Thực hiện query đơn giản để kiểm tra kết nối
      await this.dataSource.query('SELECT 1');
      
      return {
        status: 'OK',
        message: 'Kết nối database thành công',
        database: this.dataSource.options.database,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'Không thể kết nối database',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
