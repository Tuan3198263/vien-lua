import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

/**
 * Cấu hình AWS S3 Client
 * Sử dụng để kết nối và thao tác với AWS S3
 */
@Injectable()
export class S3Config {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // Khởi tạo S3 Client
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  /**
   * Lấy S3 Client instance
   */
  getS3Client(): S3Client {
    return this.s3Client;
  }

  /**
   * Lấy tên bucket
   */
  getBucketName(): string {
    return this.bucketName;
  }
}
