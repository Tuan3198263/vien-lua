/**
 * Đề Cương Thí Nghiệm API Service
 */

import axiosInstance from '../axios';
import { API_URL } from '@/config/api.config';
import {
  ApiSuccessResponse,
  PaginationParams,
  DeCuongThiNghiem,
  DeCuongThiNghiemDto,
  DanhSachSoLuongThiNghiem,
  DanhSachSoLuongThiNghiemDto,
} from '@/interfaces';
import { getPaginatedData, deleteData, getData, exportExcel } from './coreApi';

/**
 * API services cho module Đề Cương Thí Nghiệm chính
 */
export const deCuongThiNghiemApi = {
  /**
   * Lấy danh sách đề cương thí nghiệm có phân trang
   */
  getAll: (params?: PaginationParams) =>
    getPaginatedData<DeCuongThiNghiem>(API_URL.DE_CUONG_THI_NGHIEM, params),

  /**
   * Lấy chi tiết đề cương thí nghiệm (kèm relations)
   */
  getById: (id: number) =>
    getData<DeCuongThiNghiem>(`${API_URL.DE_CUONG_THI_NGHIEM}/${id}`),

  /**
   * Tạo đề cương thí nghiệm mới với file (multipart/form-data)
   * @param data - Dữ liệu đề cương thí nghiệm
   * @param file - File đính kèm (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  create: async (
    data: DeCuongThiNghiemDto,
    file?: File,
    onProgress?: (percent: number) => void
  ): Promise<DeCuongThiNghiem> => {
    const formData = new FormData();
    
    // Thêm các fields bắt buộc
    formData.append('de_tai_id', data.de_tai_id.toString());
    formData.append('ten_thi_nghiem', data.ten_thi_nghiem);
    formData.append('loai_hinh_thi_nghiem', data.loai_hinh_thi_nghiem);
    formData.append('ngay_bat_dau', data.ngay_bat_dau);
    formData.append('ngay_ket_thuc', data.ngay_ket_thuc);
    formData.append('mua_vu', data.mua_vu);
    formData.append('nguoi_thuc_hien', data.nguoi_thuc_hien);
    formData.append('kinh_phi_ky_thuat', data.kinh_phi_ky_thuat.toString());
    formData.append('kinh_phi_lao_dong', data.kinh_phi_lao_dong.toString());
    formData.append('kinh_phi_nguyen_vat_lieu', data.kinh_phi_nguyen_vat_lieu.toString());
    
    // Thêm file nếu có
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.post<ApiSuccessResponse<DeCuongThiNghiem>>(
      API_URL.DE_CUONG_THI_NGHIEM,
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
   * Cập nhật đề cương thí nghiệm với các tùy chọn file
   * @param id - ID đề cương thí nghiệm
   * @param data - Dữ liệu cập nhật
   * @param file - File mới (optional, ghi đè file cũ)
   * @param deleteFile - Xóa file hiện tại (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  update: async (
    id: number,
    data: Partial<DeCuongThiNghiemDto>,
    file?: File,
    deleteFile?: boolean,
    onProgress?: (percent: number) => void
  ): Promise<DeCuongThiNghiem> => {
    const formData = new FormData();
    
    // Thêm các fields cập nhật (nếu có)
    if (data.de_tai_id !== undefined) {
      formData.append('de_tai_id', data.de_tai_id.toString());
    }
    if (data.ten_thi_nghiem !== undefined) {
      formData.append('ten_thi_nghiem', data.ten_thi_nghiem);
    }
    if (data.loai_hinh_thi_nghiem !== undefined) {
      formData.append('loai_hinh_thi_nghiem', data.loai_hinh_thi_nghiem);
    }
    if (data.ngay_bat_dau !== undefined) {
      formData.append('ngay_bat_dau', data.ngay_bat_dau);
    }
    if (data.ngay_ket_thuc !== undefined) {
      formData.append('ngay_ket_thuc', data.ngay_ket_thuc);
    }
    if (data.mua_vu !== undefined) {
      formData.append('mua_vu', data.mua_vu);
    }
    if (data.nguoi_thuc_hien !== undefined) {
      formData.append('nguoi_thuc_hien', data.nguoi_thuc_hien);
    }
    if (data.kinh_phi_ky_thuat !== undefined) {
      formData.append('kinh_phi_ky_thuat', data.kinh_phi_ky_thuat.toString());
    }
    if (data.kinh_phi_lao_dong !== undefined) {
      formData.append('kinh_phi_lao_dong', data.kinh_phi_lao_dong.toString());
    }
    if (data.kinh_phi_nguyen_vat_lieu !== undefined) {
      formData.append('kinh_phi_nguyen_vat_lieu', data.kinh_phi_nguyen_vat_lieu.toString());
    }

    // Xóa file (nếu yêu cầu)
    if (deleteFile) {
      formData.append('xoa_file', 'true');
    }

    // Thêm file mới (nếu có)
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.patch<ApiSuccessResponse<DeCuongThiNghiem>>(
      `${API_URL.DE_CUONG_THI_NGHIEM}/${id}`,
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
   * Xóa đề cương thí nghiệm (cascade xóa các con và file)
   */
  delete: (id: number) =>
    deleteData(`${API_URL.DE_CUONG_THI_NGHIEM}/${id}`),

  /**
   * Export danh sách đề cương thí nghiệm ra Excel
   */
  export: (params?: Record<string, any>) => 
    exportExcel(`${API_URL.DE_CUONG_THI_NGHIEM}/export`, params),
};

/**
 * API services cho Danh Sách Số Lượng Thí Nghiệm (sub-module, không có file)
 */
export const danhSachSoLuongThiNghiemApi = {
  /**
   * Lấy danh sách số lượng thí nghiệm của một đề cương
   */
  getAll: (deCuongId: number) =>
    getData<DanhSachSoLuongThiNghiem[]>(`${API_URL.DE_CUONG_THI_NGHIEM}/${deCuongId}/danh-sach-so-luong`),

  /**
   * Thêm danh sách số lượng thí nghiệm
   * @param deCuongId - ID đề cương thí nghiệm
   * @param data - Dữ liệu danh sách số lượng
   */
  create: async (
    deCuongId: number,
    data: DanhSachSoLuongThiNghiemDto
  ): Promise<DanhSachSoLuongThiNghiem> => {
    const response = await axiosInstance.post<ApiSuccessResponse<DanhSachSoLuongThiNghiem>>(
      `${API_URL.DE_CUONG_THI_NGHIEM}/${deCuongId}/danh-sach-so-luong`,
      data
    );

    return response.data.data;
  },

  /**
   * Cập nhật danh sách số lượng thí nghiệm
   * @param deCuongId - ID đề cương thí nghiệm
   * @param id - ID danh sách số lượng
   * @param data - Dữ liệu cập nhật
   */
  update: async (
    deCuongId: number,
    id: number,
    data: Partial<DanhSachSoLuongThiNghiemDto>
  ): Promise<DanhSachSoLuongThiNghiem> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<DanhSachSoLuongThiNghiem>>(
      `${API_URL.DE_CUONG_THI_NGHIEM}/${deCuongId}/danh-sach-so-luong/${id}`,
      data
    );

    return response.data.data;
  },

  /**
   * Xóa danh sách số lượng thí nghiệm
   */
  delete: (deCuongId: number, id: number) =>
    deleteData(`${API_URL.DE_CUONG_THI_NGHIEM}/${deCuongId}/danh-sach-so-luong/${id}`),
};
