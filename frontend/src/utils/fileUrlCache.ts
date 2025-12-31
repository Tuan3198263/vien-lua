/**
 * Utility để cache URL file từ S3
 * Tránh tạo presigned URL nhiều lần không cần thiết
 */

interface CachedUrl {
  url: string;
  expiresAt: number; // Timestamp (ms)
}

const urlCache = new Map<number, CachedUrl>();

/**
 * Lấy URL từ cache hoặc file data
 * Nếu URL trong cache còn hiệu lực → Dùng lại
 * Nếu hết hạn hoặc chưa có → Cache URL mới
 * 
 * @param fileId - ID của file
 * @param urlXem - URL từ API response
 * @param expiresIn - Thời gian hết hạn (giây), mặc định 3600 (1 giờ)
 * @returns URL để xem/download file
 */
export const getFileUrl = (
  fileId: number,
  urlXem: string,
  expiresIn: number = 3600,
): string => {
  const now = Date.now();
  const cached = urlCache.get(fileId);

  // Nếu có cache và chưa hết hạn → Dùng lại URL cũ
  if (cached && cached.expiresAt > now) {
    return cached.url;
  }

  // Cache URL mới (trừ 60s để an toàn, tránh dùng URL sắp hết hạn)
  urlCache.set(fileId, {
    url: urlXem,
    expiresAt: now + (expiresIn - 60) * 1000,
  });

  return urlXem;
};

/**
 * Xóa cache của 1 file
 * Dùng khi cần refresh URL (ví dụ: sau khi upload file mới)
 * 
 * @param fileId - ID của file cần xóa cache
 */
export const clearFileUrlCache = (fileId: number): void => {
  urlCache.delete(fileId);
};

/**
 * Xóa tất cả cache URL
 * Dùng khi logout hoặc cần reset toàn bộ cache
 */
export const clearAllFileUrlCache = (): void => {
  urlCache.clear();
};

/**
 * Kiểm tra xem URL của file còn trong cache không
 * 
 * @param fileId - ID của file
 * @returns true nếu có cache và còn hiệu lực
 */
export const hasValidCache = (fileId: number): boolean => {
  const cached = urlCache.get(fileId);
  if (!cached) return false;
  
  return cached.expiresAt > Date.now();
};
