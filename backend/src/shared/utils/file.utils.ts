import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

/**
 * Utility class cho xử lý file
 * Cung cấp các helper functions liên quan đến file
 */
export class FileUtils {
  /**
   * Tạo tên file unique để tránh trùng lặp trên S3
   * Format: ten-file_timestamp_uuid.ext
   * @param originalName - Tên file gốc
   * @returns Tên file unique
   */
  static generateUniqueFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    
    // Chuẩn hóa tên file: bỏ dấu, thay khoảng trắng bằng -
    const normalizedName = FileUtils.normalizeFileName(nameWithoutExt);
    
    const timestamp = Date.now();
    const uuid = uuidv4().substring(0, 8);
    
    return `${normalizedName}_${timestamp}_${uuid}${ext}`;
  }

  /**
   * Chuẩn hóa tên file: bỏ dấu, lowercase, thay khoảng trắng
   * @param fileName - Tên file cần chuẩn hóa
   * @returns Tên file đã chuẩn hóa
   */
  static normalizeFileName(fileName: string): string {
    return fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // Thay ký tự đặc biệt bằng -
      .replace(/-+/g, '-') // Loại bỏ nhiều dấu - liên tiếp
      .replace(/^-|-$/g, ''); // Loại bỏ - ở đầu và cuối
  }

  /**
   * Format kích thước file thành dạng dễ đọc (B, KB, MB)
   * @param bytes - Kích thước file (bytes)
   * @returns Chuỗi kích thước đã format
   */
  static formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Kiểm tra xem file có phải là định dạng cho phép không
   * @param mimetype - MIME type của file
   * @returns true nếu file hợp lệ
   */
  static isAllowedFileType(mimetype: string): boolean {
    const allowedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      
      // Images
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
    ];

    return allowedTypes.includes(mimetype);
  }

  /**
   * Lấy extension từ MIME type
   * @param mimetype - MIME type
   * @returns Extension (vd: .pdf, .jpg)
   */
  static getExtensionFromMimeType(mimetype: string): string {
    const mimeToExt: { [key: string]: string } = {
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'text/plain': '.txt',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };

    return mimeToExt[mimetype] || '';
  }
}
