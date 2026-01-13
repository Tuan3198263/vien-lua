import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * Global Exception Filter
 * Xử lý tất cả các exception trong ứng dụng
 * Đặc biệt xử lý lỗi database và trả về message thân thiện
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Đã xảy ra lỗi không mong muốn';
    let error = 'Internal Server Error';

    // Xử lý HttpException (BadRequestException, NotFoundException, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || error;
      }
    }
    // Xử lý lỗi Database (TypeORM QueryFailedError)
    else if (exception instanceof QueryFailedError) {
      const dbError = exception as any;
      
      // Lỗi vượt quá giới hạn truy vấn (max_questions)
      if (dbError.code === 'ER_USER_LIMIT_REACHED' || 
          (dbError.message && dbError.message.includes('max_questions'))) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Hệ thống đang quá tải, vui lòng thử lại sau';
        error = 'Service Unavailable';
        
        console.error('🚨 Database limit exceeded:', dbError.message);
      }
      // Lỗi database khác
      else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Lỗi kết nối cơ sở dữ liệu';
        error = 'Database Error';
        
        console.error('🚨 Database error:', dbError);
      }
    }
    // Lỗi khác
    else {
      console.error('🚨 Unexpected error:', exception);
    }

    // Trả về response
    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
