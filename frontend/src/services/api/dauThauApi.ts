/**
 * Đấu Thầu API Service
 */

import { API_URL } from '@/config/api.config';
import axiosInstance from '../axios';
import {
  DauThau,
  DanhSachDauThau,
  DauThauDto,
  DanhSachDauThauDto,
  ApiSuccessResponse,
  PaginationParams,
} from '@/interfaces';
import { getPaginatedData, getData, deleteData, exportExcel } from './coreApi';

/**
 * API services cho module Đấu Thầu chính
 */
export const dauThauApi = {
  /**
   * Lấy danh sách đấu thầu có phân trang
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<DauThau>(API_URL.DAU_THAU, params),

  /**
   * Lấy chi tiết đấu thầu (kèm relations)
   */
  getById: (id: number) => 
    getData<DauThau>(`${API_URL.DAU_THAU}/${id}`),

  /**
   * Tạo đấu thầu mới
   */
  create: async (data: DauThauDto): Promise<DauThau> => {
    const response = await axiosInstance.post<ApiSuccessResponse<DauThau>>(
      API_URL.DAU_THAU,
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật đấu thầu
   */
  update: async (id: number, data: Partial<DauThauDto>): Promise<DauThau> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<DauThau>>(
      `${API_URL.DAU_THAU}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa đấu thầu (cascade xóa các con)
   */
  delete: (id: number) => 
    deleteData(`${API_URL.DAU_THAU}/${id}`),

  /**
   * Export danh sách đấu thầu ra Excel
   */
  export: (params?: Record<string, any>) => 
    exportExcel(`${API_URL.DAU_THAU}/export`, params),
};

/**
 * API services cho Danh Sách Đấu Thầu (với file upload)
 */
export const danhSachDauThauApi = {
  /**
   * Lấy danh sách đấu thầu của một đấu thầu (kèm file info)
   */
  getAll: (dauThauId: number) => 
    getData<DanhSachDauThau[]>(`${API_URL.DAU_THAU}/${dauThauId}/danh-sach`),

  /**
   * Thêm danh sách đấu thầu với file (multipart/form-data)
   * @param dauThauId - ID đấu thầu
   * @param data - Dữ liệu danh sách đấu thầu
   * @param file - File đính kèm (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  create: async (
    dauThauId: number,
    data: DanhSachDauThauDto,
    file?: File,
    onProgress?: (percent: number) => void
  ): Promise<DanhSachDauThau> => {
    const formData = new FormData();
    formData.append('nam', data.nam.toString());
    formData.append('kinh_phi', data.kinh_phi.toString());
    if (data.hinh_thuc) formData.append('hinh_thuc', data.hinh_thuc);
    if (data.buoc) formData.append('buoc', data.buoc);
    if (data.trang_thai) formData.append('trang_thai', data.trang_thai);
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.post<ApiSuccessResponse<DanhSachDauThau>>(
      `${API_URL.DAU_THAU}/${dauThauId}/danh-sach`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );

    return response.data.data;
  },

  /**
   * Cập nhật danh sách đấu thầu với các tùy chọn file
   * @param dauThauId - ID đấu thầu
   * @param id - ID danh sách đấu thầu
   * @param data - Dữ liệu cập nhật
   * @param file - File mới (optional, ghi đè file cũ)
   * @param deleteFile - Xóa file hiện tại (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  update: async (
    dauThauId: number,
    id: number,
    data: Partial<DanhSachDauThauDto>,
    file?: File,
    deleteFile?: boolean,
    onProgress?: (percent: number) => void
  ): Promise<DanhSachDauThau> => {
    const formData = new FormData();
    
    // Thêm các fields cập nhật (nếu có)
    if (data.nam !== undefined) {
      formData.append('nam', data.nam.toString());
    }
    if (data.kinh_phi !== undefined) {
      formData.append('kinh_phi', data.kinh_phi.toString());
    }
    if (data.hinh_thuc !== undefined) {
      formData.append('hinh_thuc', data.hinh_thuc);
    }
    if (data.buoc !== undefined) {
      formData.append('buoc', data.buoc);
    }
    if (data.trang_thai !== undefined) {
      formData.append('trang_thai', data.trang_thai);
    }

    // Xóa file (nếu yêu cầu)
    if (deleteFile) {
      formData.append('xoa_file', 'true');
    }

    // Thêm file mới (nếu có)
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.patch<ApiSuccessResponse<DanhSachDauThau>>(
      `${API_URL.DAU_THAU}/${dauThauId}/danh-sach/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );

    return response.data.data;
  },

  /**
   * Xóa danh sách đấu thầu (xóa cả file nếu có)
   */
  delete: (dauThauId: number, id: number) =>
    deleteData(
      `${API_URL.DAU_THAU}/${dauThauId}/danh-sach/${id}`
    ),
};
