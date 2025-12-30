/**
 * useDebounce hook - Debounce một giá trị
 */

import { useState, useEffect } from 'react';
import { DEBOUNCE_TIME } from '@/config/app.config';

/**
 * Hook debounce một giá trị
 * Giá trị sẽ chỉ được cập nhật sau một khoảng thời gian delay
 * Hữu ích cho search input để tránh gọi API quá nhiều lần
 * 
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay (ms), mặc định DEBOUNCE_TIME
 * @returns Giá trị đã được debounce
 */
export const useDebounce = <T>(value: T, delay: number = DEBOUNCE_TIME): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout để cập nhật giá trị
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Clear timeout nếu value thay đổi trước khi timeout
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
