/**
 * Hợp Đồng API Service
 */

import { 
  HopDong,
  HopDongDto,
  PaginationParams
} from '@/interfaces';
import { API_URL } from '@/config/api.config';
import { getData, getPaginatedData, deleteData } from './coreApi';
import axiosInstance from '../axios';
import { ApiSuccessResponse } from '@/interfaces';

/**
 * API services cho module Hợp Đồng
 */
export const hopDongApi = {
  /**
   * Lấy danh sách hợp đồng có phân trang
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<HopDong>(API_URL.HOP_DONG, params),

  /**
   * Lấy chi tiết hợp đồng (kèm thông tin file)
   */
  getById: (id: number) => 
    getData<HopDong>(`${API_URL.HOP_DONG}/${id}`),

  /**
   * Tạo hợp đồng mới với file (nếu có)
   * @param data - Dữ liệu hợp đồng
   * @param file - File đính kèm (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  create: async (
    data: HopDongDto, 
    file?: File,
    onProgress?: (percent: number) => void
  ): Promise<HopDong> => {
    const formData = new FormData();
    formData.append('so_hop_dong', data.so_hop_dong);
    formData.append('doi_tac', data.doi_tac);
    if (data.ghi_chu) {
      formData.append('ghi_chu', data.ghi_chu);
    }
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.post<ApiSuccessResponse<HopDong>>(
      API_URL.HOP_DONG,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );

    return response.data.data;
  },

  /**
   * Cập nhật hợp đồng với các tùy chọn file
   * @param id - ID hợp đồng
   * @param data - Dữ liệu cập nhật
   * @param file - File mới (optional, ghi đè file cũ)
   * @param deleteFile - Xóa file hiện tại (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  update: async (
    id: number,
    data: Partial<HopDongDto>,
    file?: File,
    deleteFile?: boolean,
    onProgress?: (percent: number) => void
  ): Promise<HopDong> => {
    const formData = new FormData();
    
    // Thêm các fields cập nhật (nếu có)
    if (data.so_hop_dong) {
      formData.append('so_hop_dong', data.so_hop_dong);
    }
    if (data.doi_tac) {
      formData.append('doi_tac', data.doi_tac);
    }
    if (data.ghi_chu !== undefined) {
      formData.append('ghi_chu', data.ghi_chu);
    }

    // Xóa file (nếu yêu cầu)
    if (deleteFile) {
      formData.append('xoa_file', 'true');
    }

    // Upload file mới (nếu có)
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.patch<ApiSuccessResponse<HopDong>>(
      `${API_URL.HOP_DONG}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );

    return response.data.data;
  },

  /**
   * Xóa hợp đồng (bao gồm cả file nếu có)
   */
  delete: (id: number) => 
    deleteData(`${API_URL.HOP_DONG}/${id}`),
};
