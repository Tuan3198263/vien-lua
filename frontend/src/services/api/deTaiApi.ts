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
import { getData, getPaginatedData, deleteData } from './coreApi';
import axiosInstance from '../axios';
import { ApiSuccessResponse } from '@/interfaces';

/**
 * API services cho module Đề Tài chính
 */
export const deTaiApi = {
  /**
   * Lấy danh sách đề tài có phân trang
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<DeTai>('/de-tai', params),

  /**
   * Lấy chi tiết đề tài (kèm relations)
   */
  getById: (id: number) => 
    getData<DeTai>(`/de-tai/${id}`),

  /**
   * Tạo đề tài mới
   */
  create: async (data: DeTaiDto): Promise<DeTai> => {
    const response = await axiosInstance.post<ApiSuccessResponse<DeTai>>(
      '/de-tai',
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật đề tài
   */
  update: async (id: number, data: Partial<DeTaiDto>): Promise<DeTai> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<DeTai>>(
      `/de-tai/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa đề tài (cascade xóa các con)
   */
  delete: (id: number) => 
    deleteData(`/de-tai/${id}`),
};

/**
 * API services cho Kinh Phí Năm
 */
export const kinhPhiNamApi = {
  /**
   * Lấy danh sách kinh phí theo năm của một đề tài
   */
  getAll: (deTaiId: number) => 
    getData<KinhPhiNam[]>(`/de-tai/${deTaiId}/kinh-phi-nam`),

  /**
   * Thêm kinh phí theo năm
   */
  create: async (deTaiId: number, data: KinhPhiNamDto): Promise<KinhPhiNam> => {
    const response = await axiosInstance.post<ApiSuccessResponse<KinhPhiNam>>(
      `/de-tai/${deTaiId}/kinh-phi-nam`,
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật kinh phí theo năm
   */
  update: async (id: number, data: Partial<KinhPhiNamDto>): Promise<KinhPhiNam> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<KinhPhiNam>>(
      `/de-tai/kinh-phi-nam/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa kinh phí theo năm
   */
  delete: (id: number) => 
    deleteData(`/de-tai/kinh-phi-nam/${id}`),
};

/**
 * API services cho Sản Phẩm Dự Kiến
 */
export const sanPhamApi = {
  /**
   * Lấy danh sách sản phẩm dự kiến của một đề tài
   */
  getAll: (deTaiId: number) => 
    getData<SanPham[]>(`/de-tai/${deTaiId}/san-pham`),

  /**
   * Thêm sản phẩm dự kiến
   */
  create: async (deTaiId: number, data: SanPhamDto): Promise<SanPham> => {
    const response = await axiosInstance.post<ApiSuccessResponse<SanPham>>(
      `/de-tai/${deTaiId}/san-pham`,
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật sản phẩm dự kiến
   */
  update: async (id: number, data: Partial<SanPhamDto>): Promise<SanPham> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<SanPham>>(
      `/de-tai/san-pham/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa sản phẩm dự kiến
   */
  delete: (id: number) => 
    deleteData(`/de-tai/san-pham/${id}`),
};

/**
 * API services cho Sản Phẩm Thực Tế
 */
export const sanPhamThucTeApi = {
  /**
   * Lấy danh sách sản phẩm thực tế của một đề tài
   */
  getAll: (deTaiId: number) => 
    getData<SanPhamThucTe[]>(`/de-tai/${deTaiId}/san-pham-thuc-te`),

  /**
   * Thêm sản phẩm thực tế
   */
  create: async (deTaiId: number, data: SanPhamThucTeDto): Promise<SanPhamThucTe> => {
    const response = await axiosInstance.post<ApiSuccessResponse<SanPhamThucTe>>(
      `/de-tai/${deTaiId}/san-pham-thuc-te`,
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật sản phẩm thực tế
   */
  update: async (id: number, data: Partial<SanPhamThucTeDto>): Promise<SanPhamThucTe> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<SanPhamThucTe>>(
      `/de-tai/san-pham-thuc-te/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa sản phẩm thực tế
   */
  delete: (id: number) => 
    deleteData(`/de-tai/san-pham-thuc-te/${id}`),
};

/**
 * API services cho Hồ Sơ Lưu Trữ (với file upload)
 */
export const hoSoLuuTruApi = {
  /**
   * Lấy danh sách hồ sơ lưu trữ của một đề tài (kèm file info)
   */
  getAll: (deTaiId: number) => 
    getData<HoSoLuuTru[]>(`/de-tai/${deTaiId}/ho-so`),

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
      `/de-tai/${deTaiId}/ho-so`,
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
      `/de-tai/ho-so/${id}`,
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
  delete: (id: number) => 
    deleteData(`/de-tai/ho-so/${id}`),
};
