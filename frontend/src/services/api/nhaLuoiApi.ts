/**
 * Nhà Lưới API Service
 */

import { API_URL } from '@/config/api.config';
import axiosInstance from '../axios';
import {
  NhaLuoi,
  LanSuDung,
  NhaLuoiDto,
  LanSuDungDto,
  ApiSuccessResponse,
  PaginationParams,
} from '@/interfaces';
import { getPaginatedData, getData, deleteData, exportExcel } from './coreApi';

/**
 * API services cho module Nhà Lưới chính
 */
export const nhaLuoiApi = {
  /**
   * Lấy danh sách nhà lưới có phân trang
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<NhaLuoi>(API_URL.NHA_LUOI, params),

  /**
   * Lấy chi tiết nhà lưới (kèm relations)
   */
  getById: (id: number) => 
    getData<NhaLuoi>(`${API_URL.NHA_LUOI}/${id}`),

  /**
   * Tạo nhà lưới mới
   */
  create: async (data: NhaLuoiDto): Promise<NhaLuoi> => {
    const response = await axiosInstance.post<ApiSuccessResponse<NhaLuoi>>(
      API_URL.NHA_LUOI,
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật nhà lưới
   */
  update: async (id: number, data: Partial<NhaLuoiDto>): Promise<NhaLuoi> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<NhaLuoi>>(
      `${API_URL.NHA_LUOI}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa nhà lưới (cascade xóa các lần sử dụng con và files)
   */
  delete: (id: number) => 
    deleteData(`${API_URL.NHA_LUOI}/${id}`),

  /**
   * Export danh sách nhà lưới ra Excel
   */
  export: (params?: Record<string, any>) => 
    exportExcel(`${API_URL.NHA_LUOI}/export`, params),
};

/**
 * API services cho Lần Sử Dụng Nhà Lưới (với file upload)
 */
export const lanSuDungApi = {
  /**
   * Lấy danh sách lần sử dụng của một nhà lưới (kèm file info)
   */
  getAll: (nhaLuoiId: number) => 
    getData<LanSuDung[]>(`${API_URL.NHA_LUOI}/${nhaLuoiId}/lan-su-dung`),

  /**
   * Lấy chi tiết lần sử dụng
   */
  getById: (nhaLuoiId: number, id: number) =>
    getData<LanSuDung>(`${API_URL.NHA_LUOI}/${nhaLuoiId}/lan-su-dung/${id}`),

  /**
   * Thêm lần sử dụng với file (multipart/form-data)
   * @param nhaLuoiId - ID nhà lưới
   * @param data - Dữ liệu lần sử dụng
   * @param file - File đính kèm (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  create: async (
    nhaLuoiId: number,
    data: LanSuDungDto,
    file?: File,
    onProgress?: (percent: number) => void
  ): Promise<LanSuDung> => {
    const formData = new FormData();
    formData.append('de_cuong_thi_nghiem_id', data.de_cuong_thi_nghiem_id.toString());
    if (data.dung_cu) formData.append('dung_cu', data.dung_cu);
    if (data.so_luong !== undefined) formData.append('so_luong', data.so_luong.toString());
    if (data.ngay_muon) formData.append('ngay_muon', data.ngay_muon);
    if (data.ngay_tra) formData.append('ngay_tra', data.ngay_tra);
    if (data.khau_hao !== undefined) formData.append('khau_hao', data.khau_hao.toString());
    if (data.hien_trang) formData.append('hien_trang', data.hien_trang);
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.post<ApiSuccessResponse<LanSuDung>>(
      `${API_URL.NHA_LUOI}/${nhaLuoiId}/lan-su-dung`,
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
   * Cập nhật lần sử dụng với các tùy chọn file
   * @param nhaLuoiId - ID nhà lưới
   * @param id - ID lần sử dụng
   * @param data - Dữ liệu cập nhật
   * @param file - File mới (optional, ghi đè file cũ)
   * @param deleteFile - Xóa file hiện tại (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  update: async (
    nhaLuoiId: number,
    id: number,
    data: Partial<LanSuDungDto>,
    file?: File,
    deleteFile?: boolean,
    onProgress?: (percent: number) => void
  ): Promise<LanSuDung> => {
    const formData = new FormData();
    
    // Thêm các fields cập nhật (nếu có)
    if (data.de_cuong_thi_nghiem_id !== undefined) {
      formData.append('de_cuong_thi_nghiem_id', data.de_cuong_thi_nghiem_id.toString());
    }
    if (data.dung_cu !== undefined) {
      formData.append('dung_cu', data.dung_cu);
    }
    if (data.so_luong !== undefined) {
      formData.append('so_luong', data.so_luong.toString());
    }
    if (data.ngay_muon !== undefined) {
      formData.append('ngay_muon', data.ngay_muon);
    }
    if (data.ngay_tra !== undefined) {
      formData.append('ngay_tra', data.ngay_tra);
    }
    if (data.khau_hao !== undefined) {
      formData.append('khau_hao', data.khau_hao.toString());
    }
    if (data.hien_trang !== undefined) {
      formData.append('hien_trang', data.hien_trang);
    }

    // Xóa file (nếu yêu cầu)
    if (deleteFile) {
      formData.append('xoa_file', 'true');
    }

    // Thêm file mới (nếu có)
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.patch<ApiSuccessResponse<LanSuDung>>(
      `${API_URL.NHA_LUOI}/${nhaLuoiId}/lan-su-dung/${id}`,
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
   * Xóa lần sử dụng (xóa cả file nếu có)
   */
  delete: (nhaLuoiId: number, id: number) =>
    deleteData(
      `${API_URL.NHA_LUOI}/${nhaLuoiId}/lan-su-dung/${id}`
    ),
};
