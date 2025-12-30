/**
 * Date utilities - Các hàm xử lý ngày tháng
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { DATE_FORMAT } from '@/config/app.config';

// Extend dayjs với plugin relativeTime
dayjs.extend(relativeTime);

// Set locale mặc định là tiếng Việt
dayjs.locale('vi');

/**
 * Format ngày theo format hiển thị (DD/MM/YYYY)
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return dayjs(date).format(DATE_FORMAT.DISPLAY);
};

/**
 * Format ngày giờ theo format hiển thị (DD/MM/YYYY HH:mm:ss)
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return dayjs(date).format(DATE_FORMAT.DISPLAY_TIME);
};

/**
 * Format ngày theo format API (YYYY-MM-DD)
 */
export const formatDateForApi = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return dayjs(date).format(DATE_FORMAT.API);
};

/**
 * Format ngày giờ theo format API (YYYY-MM-DD HH:mm:ss)
 */
export const formatDateTimeForApi = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return dayjs(date).format(DATE_FORMAT.API_TIME);
};

/**
 * Tính khoảng cách thời gian từ bây giờ (vd: "2 giờ trước")
 */
export const fromNow = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  return dayjs(date).fromNow();
};

/**
 * Kiểm tra ngày có hợp lệ không
 */
export const isValidDate = (date: any): boolean => {
  return dayjs(date).isValid();
};

/**
 * So sánh 2 ngày
 * @returns true nếu date1 sau date2
 */
export const isAfter = (date1: string | Date, date2: string | Date): boolean => {
  return dayjs(date1).isAfter(dayjs(date2));
};

/**
 * So sánh 2 ngày
 * @returns true nếu date1 trước date2
 */
export const isBefore = (date1: string | Date, date2: string | Date): boolean => {
  return dayjs(date1).isBefore(dayjs(date2));
};
