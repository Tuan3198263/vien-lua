/**
 * usePagination hook - Hook quản lý state phân trang
 */

import { useState, useCallback } from 'react';
import { PAGINATION_CONFIG } from '@/config/app.config';

/**
 * Interface cho pagination state
 */
export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

/**
 * Interface cho return value của usePagination
 */
export interface UsePaginationReturn {
  pagination: PaginationState;
  setPagination: (pagination: Partial<PaginationState>) => void;
  resetPagination: () => void;
  goToFirstPage: () => void;
  goToPage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
}

/**
 * Hook quản lý phân trang
 * 
 * @param initialPageSize - Page size ban đầu
 * @returns Pagination state và các functions
 */
export const usePagination = (
  initialPageSize: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE
): UsePaginationReturn => {
  const [pagination, setPaginationState] = useState<PaginationState>({
    current: PAGINATION_CONFIG.DEFAULT_PAGE,
    pageSize: initialPageSize,
    total: 0,
  });

  /**
   * Cập nhật pagination state
   */
  const setPagination = useCallback((newPagination: Partial<PaginationState>) => {
    setPaginationState((prev) => ({
      ...prev,
      ...newPagination,
    }));
  }, []);

  /**
   * Reset về trang đầu tiên
   */
  const resetPagination = useCallback(() => {
    setPaginationState({
      current: PAGINATION_CONFIG.DEFAULT_PAGE,
      pageSize: initialPageSize,
      total: 0,
    });
  }, [initialPageSize]);

  /**
   * Về trang đầu tiên (giữ nguyên pageSize và total)
   */
  const goToFirstPage = useCallback(() => {
    setPaginationState((prev) => ({
      ...prev,
      current: PAGINATION_CONFIG.DEFAULT_PAGE,
    }));
  }, []);

  /**
   * Chuyển đến trang cụ thể
   */
  const goToPage = useCallback((page: number) => {
    setPaginationState((prev) => ({
      ...prev,
      current: page,
    }));
  }, []);

  /**
   * Thay đổi page size và về trang đầu
   */
  const changePageSize = useCallback((pageSize: number) => {
    setPaginationState((prev) => ({
      ...prev,
      current: PAGINATION_CONFIG.DEFAULT_PAGE,
      pageSize,
    }));
  }, []);

  return {
    pagination,
    setPagination,
    resetPagination,
    goToFirstPage,
    goToPage,
    changePageSize,
  };
};
