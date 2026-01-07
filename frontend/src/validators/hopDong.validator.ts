/**
 * Validation rules cho module Hợp Đồng
 * Mirror từ backend để đảm bảo đồng bộ
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Validation rules cho hợp đồng
 * Đồng bộ với backend DTOs
 */
export const HOP_DONG_RULES = {
  /**
   * Số hợp đồng: Bắt buộc, tối đa 50 ký tự, unique
   */
  so_hop_dong: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 50, message: 'Số hợp đồng không được quá 50 ký tự' },
    { 
      pattern: /^[A-Za-z0-9\-\/]+$/, 
      message: 'Số hợp đồng chỉ chứa chữ, số, dấu gạch ngang và dấu gạch chéo' 
    },
  ] as Rule[],

  /**
   * Đối tác: Bắt buộc, tối đa 100 ký tự
   */
  doi_tac: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 100, message: 'Tên đối tác không được quá 100 ký tự' },
  ] as Rule[],

  /**
   * Ghi chú: Tùy chọn, tối đa 255 ký tự
   */
  ghi_chu: [
    { max: 255, message: 'Ghi chú không được quá 255 ký tự' },
  ] as Rule[],
};

/**
 * Validation cho file upload
 * Tham khảo từ file.utils.ts ở backend
 */
export const FILE_VALIDATION = {
  /**
   * Kích thước file tối đa: 10MB
   */
  MAX_FILE_SIZE: 4 * 1024 * 1024, // 4MB in bytes

  /**
   * Các loại file được phép
   */
  ALLOWED_FILE_TYPES: [
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
  ],

  /**
   * Extension tương ứng
   */
  ALLOWED_EXTENSIONS: [
    '.pdf', '.doc', '.docx', '.txt',
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
  ],

  /**
   * Kiểm tra file có hợp lệ không
   */
  isValidFile: (file: File): { valid: boolean; error?: string } => {
    // Kiểm tra kích thước
    if (file.size > FILE_VALIDATION.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File không được vượt quá ${FILE_VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB`,
      };
    }

    // Kiểm tra loại file
    if (!FILE_VALIDATION.ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Loại file không được hỗ trợ. Chỉ chấp nhận: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP',
      };
    }

    return { valid: true };
  },

  /**
   * Format kích thước file
   */
  formatFileSize: (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  },
};
