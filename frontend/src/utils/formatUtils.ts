/**
 * Format utilities - Các hàm format dữ liệu
 */

/**
 * Format số điện thoại
 * @param phone - Số điện thoại
 * @returns Số điện thoại đã format
 */
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return '-';
  
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: 0xxx xxx xxx hoặc 0xxx xxx xxxx
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format số tiền (thêm dấu phẩy ngăn cách)
 * @param amount - Số tiền
 * @param currency - Đơn vị tiền tệ (mặc định: VNĐ)
 * @returns Số tiền đã format
 */
export const formatCurrency = (
  amount: number | null | undefined,
  currency: string = 'VNĐ'
): string => {
  if (amount === null || amount === undefined) return '-';
  
  const formatted = amount.toLocaleString('vi-VN');
  return currency ? `${formatted} ${currency}` : formatted;
};

/**
 * Format trạng thái boolean thành text
 * @param status - Trạng thái
 * @param trueText - Text khi true (mặc định: "Hoạt động")
 * @param falseText - Text khi false (mặc định: "Không hoạt động")
 * @returns Text trạng thái
 */
export const formatStatus = (
  status: boolean | null | undefined,
  trueText: string = 'Hoạt động',
  falseText: string = 'Không hoạt động'
): string => {
  if (status === null || status === undefined) return '-';
  return status ? trueText : falseText;
};

/**
 * Cắt ngắn text và thêm "..."
 * @param text - Text cần cắt
 * @param maxLength - Độ dài tối đa
 * @returns Text đã cắt
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 50
): string => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalize chữ cái đầu
 * @param text - Text cần capitalize
 * @returns Text đã capitalize
 */
export const capitalize = (text: string | null | undefined): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format file size
 * @param bytes - Kích thước file (bytes)
 * @returns File size đã format (vd: 1.5 MB)
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format percent
 * @param value - Giá trị
 * @param total - Tổng
 * @param decimals - Số chữ số thập phân
 * @returns Phần trăm đã format
 */
export const formatPercent = (
  value: number,
  total: number,
  decimals: number = 1
): string => {
  if (total === 0) return '0%';
  const percent = (value / total) * 100;
  return `${percent.toFixed(decimals)}%`;
};
