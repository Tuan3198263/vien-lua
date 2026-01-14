/**
 * Đề Tài API Service
 */

import { 
  DeTai,
  DeTaiDto,
  KinhPhiNam,
  KinhPhiNamDto,
  SanPham,
  SanPhamDto,
  SanPhamThucTe,
  SanPhamThucTeDto,
  HoSoLuuTru,
  HoSoLuuTruDto,
  PaginationParams
} from '@/interfaces';
import { getData, getPaginatedData, deleteData, exportExcel } from './coreApi';
import axiosInstance from '../axios';
import { API_URL } from '@/config/api.config';
import { ApiSuccessResponse } from '@/interfaces';

/**
 * API services cho module Đề Tài chính
 */
export const deTaiApi = {
  /**
   * Lấy danh sách đề tài có phân trang
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<DeTai>(API_URL.DE_TAI, params),

  /**
   * Lấy chi tiết đề tài (kèm relations)
   */
  getById: (id: number) => 
    getData<DeTai>(`${API_URL.DE_TAI}/${id}`),

  /**
   * Tạo đề tài mới
   */
  create: async (data: DeTaiDto): Promise<DeTai> => {
    const response = await axiosInstance.post<ApiSuccessResponse<DeTai>>(
      API_URL.DE_TAI,
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật đề tài
   */
  update: async (id: number, data: Partial<DeTaiDto>): Promise<DeTai> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<DeTai>>(
      `${API_URL.DE_TAI}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa đề tài (cascade xóa các con)
   */
  delete: (id: number) => 
    deleteData(`${API_URL.DE_TAI}/${id}`),

  /**
   * Export danh sách đề tài ra Excel
   * @param params - Filter params (search, sort, filters) - KHÔNG có page/limit
   */
  export: (params?: Record<string, any>) =>
    exportExcel(`${API_URL.DE_TAI}/export`, params),
};

/**
 * API services cho Kinh Phí Năm
 */
export const kinhPhiNamApi = {
  /**
   * Lấy danh sách kinh phí theo năm của một đề tài
   */
  getAll: (deTaiId: number) => 
    getData<KinhPhiNam[]>(`${API_URL.DE_TAI}/${deTaiId}/kinh-phi`),

  /**
   * Thêm kinh phí theo năm
   */
  create: async (deTaiId: number, data: KinhPhiNamDto): Promise<KinhPhiNam> => {
    const response = await axiosInstance.post<ApiSuccessResponse<KinhPhiNam>>(
      `${API_URL.DE_TAI}/${deTaiId}/kinh-phi`,
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật kinh phí theo năm
   */
  update: async (
    deTaiId: number,
    id: number,
    data: Partial<KinhPhiNamDto>
  ): Promise<KinhPhiNam> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<KinhPhiNam>>(
      `${API_URL.DE_TAI}/${deTaiId}/kinh-phi/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa kinh phí theo năm
   */
 delete: (deTaiId: number, id: number) =>
    deleteData(
      `${API_URL.DE_TAI}/${deTaiId}/kinh-phi/${id}`
    ),
};

/**
 * API services cho Sản Phẩm Dự Kiến
 */
export const sanPhamApi = {
  getAll: (deTaiId: number) =>
    getData<SanPham[]>(
      `${API_URL.DE_TAI}/${deTaiId}/san-pham`
    ),

  create: async (
    deTaiId: number,
    data: SanPhamDto
  ): Promise<SanPham> => {
    const response = await axiosInstance.post<ApiSuccessResponse<SanPham>>(
      `${API_URL.DE_TAI}/${deTaiId}/san-pham`,
      data
    );
    return response.data.data;
  },

  update: async (
    deTaiId: number,
    id: number,
    data: Partial<SanPhamDto>
  ): Promise<SanPham> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<SanPham>>(
      `${API_URL.DE_TAI}/${deTaiId}/san-pham/${id}`,
      data
    );
    return response.data.data;
  },

  delete: (deTaiId: number, id: number) =>
    deleteData(
      `${API_URL.DE_TAI}/${deTaiId}/san-pham/${id}`
    ),
};

/**
 * API services cho Sản Phẩm Thực Tế
 */
export const sanPhamThucTeApi = {
  getAll: (deTaiId: number) =>
    getData<SanPhamThucTe[]>(
      `${API_URL.DE_TAI}/${deTaiId}/san-pham-thuc-te`
    ),

  create: async (
    deTaiId: number,
    data: SanPhamThucTeDto
  ): Promise<SanPhamThucTe> => {
    const response =
      await axiosInstance.post<ApiSuccessResponse<SanPhamThucTe>>(
        `${API_URL.DE_TAI}/${deTaiId}/san-pham-thuc-te`,
        data
      );
    return response.data.data;
  },

  update: async (
    deTaiId: number,
    id: number,
    data: Partial<SanPhamThucTeDto>
  ): Promise<SanPhamThucTe> => {
    const response =
      await axiosInstance.patch<ApiSuccessResponse<SanPhamThucTe>>(
        `${API_URL.DE_TAI}/${deTaiId}/san-pham-thuc-te/${id}`,
        data
      );
    return response.data.data;
  },

  delete: (deTaiId: number, id: number) =>
    deleteData(
      `${API_URL.DE_TAI}/${deTaiId}/san-pham-thuc-te/${id}`
    ),
};

/**
 * API services cho Hồ Sơ Lưu Trữ (với file upload)
 */
export const hoSoLuuTruApi = {
  /**
   * Lấy danh sách hồ sơ lưu trữ của một đề tài (kèm file info)
   */
  getAll: (deTaiId: number) => 
    getData<HoSoLuuTru[]>(`${API_URL.DE_TAI}/${deTaiId}/ho-so`),

  /**
   * Thêm hồ sơ lưu trữ với file (multipart/form-data)
   * @param deTaiId - ID đề tài
   * @param data - Dữ liệu hồ sơ
   * @param file - File đính kèm (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  create: async (
    deTaiId: number,
    data: HoSoLuuTruDto,
    file?: File,
    onProgress?: (percent: number) => void
  ): Promise<HoSoLuuTru> => {
    const formData = new FormData();
    formData.append('loai_ho_so', data.loai_ho_so);
    formData.append('nam', data.nam.toString());
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.post<ApiSuccessResponse<HoSoLuuTru>>(
      `${API_URL.DE_TAI}/${deTaiId}/ho-so`,
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
   * Cập nhật hồ sơ lưu trữ với các tùy chọn file
   * @param id - ID hồ sơ
   * @param data - Dữ liệu cập nhật
   * @param file - File mới (optional, ghi đè file cũ)
   * @param deleteFile - Xóa file hiện tại (optional)
   * @param onProgress - Callback theo dõi progress upload
   */
  update: async (
     deTaiId: number,
    id: number,
    data: Partial<HoSoLuuTruDto>,
    file?: File,
    deleteFile?: boolean,
    onProgress?: (percent: number) => void
  ): Promise<HoSoLuuTru> => {
    const formData = new FormData();
    
    // Thêm các fields cập nhật (nếu có)
    if (data.loai_ho_so) {
      formData.append('loai_ho_so', data.loai_ho_so);
    }
    if (data.nam !== undefined) {
      formData.append('nam', data.nam.toString());
    }

    // Xóa file (nếu yêu cầu)
    if (deleteFile) {
      formData.append('xoa_file', 'true');
    }

    // Thêm file mới (nếu có)
    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.patch<ApiSuccessResponse<HoSoLuuTru>>(
      `${API_URL.DE_TAI}/${deTaiId}/ho-so/${id}`,
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
   * Xóa hồ sơ lưu trữ (cascade xóa file)
   */
   delete: (deTaiId: number, id: number) =>
    deleteData(
      `${API_URL.DE_TAI}/${deTaiId}/ho-so/${id}`
    ),
};
