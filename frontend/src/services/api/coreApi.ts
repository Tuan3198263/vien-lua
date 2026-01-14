/**
 * Core API functions - Các hàm gọi API cơ bản
 */

import axiosInstance from '../axios';
import { ApiSuccessResponse, PaginatedResponse, PaginationParams } from '@/interfaces';

/**
 * GET request - Lấy dữ liệu
 * @param url - API endpoint
 * @param params - Query parameters
 * @returns Response data
 */
export const getData = async <T = any>(
  url: string,
  params?: PaginationParams | Record<string, any>
): Promise<T> => {
  const response = await axiosInstance.get<ApiSuccessResponse<T>>(url, { params });
  return response.data.data;
};

/**
 * POST request - Tạo mới dữ liệu
 * @param url - API endpoint
 * @param data - Request body
 * @returns Response data
 */
export const postData = async <T = any>(
  url: string,
  data?: any
): Promise<T> => {
  const response = await axiosInstance.post<ApiSuccessResponse<T>>(url, data);
  return response.data.data;
};

/**
 * PATCH request - Cập nhật một phần dữ liệu
 * @param url - API endpoint
 * @param data - Request body
 * @returns Response data
 */
export const updateData = async <T = any>(
  url: string,
  data?: any
): Promise<T> => {
  const response = await axiosInstance.patch<ApiSuccessResponse<T>>(url, data);
  return response.data.data;
};

/**
 * PUT request - Cập nhật toàn bộ dữ liệu
 * @param url - API endpoint
 * @param data - Request body
 * @returns Response data
 */
export const putData = async <T = any>(
  url: string,
  data?: any
): Promise<T> => {
  const response = await axiosInstance.put<ApiSuccessResponse<T>>(url, data);
  return response.data.data;
};

/**
 * DELETE request - Xóa dữ liệu
 * @param url - API endpoint
 * @returns Response data
 */
export const deleteData = async <T = any>(
  url: string
): Promise<T> => {
  const response = await axiosInstance.delete<ApiSuccessResponse<T>>(url);
  return response.data.data;
};

/**
 * GET request với phân trang - Lấy danh sách có phân trang
 * @param url - API endpoint
 * @param params - Pagination parameters
 * @returns Paginated response
 */
export const getPaginatedData = async <T = any>(
  url: string,
  params?: PaginationParams
): Promise<PaginatedResponse<T>> => {
  const response = await axiosInstance.get<PaginatedResponse<T>>(url, { params });
  return response.data;
};

/**
 * Upload file
 * @param url - API endpoint
 * @param file - File to upload
 * @param onProgress - Upload progress callback
 * @returns Response data
 */
export const uploadFile = async <T = any>(
  url: string,
  file: File,
  onProgress?: (progressEvent: any) => void
): Promise<T> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<ApiSuccessResponse<T>>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  });

  return response.data.data;
};

/**
 * Download file
 * @param url - API endpoint
 * @param filename - Tên file khi download
 */
export const downloadFile = async (url: string, filename: string): Promise<void> => {
  const response = await axiosInstance.get(url, {
    responseType: 'blob',
  });

  // Tạo link download
  const blob = new Blob([response.data]);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  
  // Cleanup
  window.URL.revokeObjectURL(link.href);
};

/**
 * Export Excel - Tải file Excel từ API
 * @param url - API endpoint (ví dụ: /api/de-tai/export)
 * @param params - Query parameters (filters, sort, etc.)
 * @param filename - Tên file khi download (optional, sẽ lấy từ response header nếu không có)
 */
export const exportExcel = async (
  url: string,
  params?: Record<string, any>,
  filename?: string
): Promise<void> => {
  const response = await axiosInstance.get(url, {
    params,
    responseType: 'blob',
  });

  // Lấy filename từ Content-Disposition header nếu không truyền vào
  if (!filename) {
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]*?)\1/);
      if (filenameMatch && filenameMatch[2]) {
        filename = decodeURIComponent(filenameMatch[2]);
      }
    }
  }

  // Nếu vẫn không có filename, tạo tên mặc định
  if (!filename) {
    const timestamp = new Date().toISOString().split('T')[0];
    filename = `Export_${timestamp}.xlsx`;
  }

  // Đảm bảo filename có extension .xlsx
  if (!filename.toLowerCase().endsWith('.xlsx')) {
    filename = `${filename}.xlsx`;
  }

  // Tạo link download với Blob type chính xác
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
 const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.style.display = 'none';
  
  // Append to body, click, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
};
