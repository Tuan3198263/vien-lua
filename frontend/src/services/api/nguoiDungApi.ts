/**
 * Người Dùng API Service
 */

import { 
  NguoiDung,
  NguoiDungDto,
  PaginationParams
} from '@/interfaces';
import { API_URL } from '@/config/api.config';
import { getData, postData, updateData, deleteData, getPaginatedData } from './coreApi';

/**
 * API services cho module Người Dùng
 */
export const nguoiDungApi = {
  /**
   * Lấy danh sách người dùng có phân trang
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<NguoiDung>(API_URL.NGUOI_DUNG, params),

  /**
   * Lấy chi tiết người dùng
   */
  getById: (id: number) => 
    getData<NguoiDung>(`${API_URL.NGUOI_DUNG}/${id}`),

  /**
   * Tạo người dùng mới
   */
  create: (data: NguoiDungDto) => 
    postData<NguoiDung>(API_URL.NGUOI_DUNG, data),

  /**
   * Cập nhật người dùng
   */
  update: (id: number, data: Partial<NguoiDungDto>) => 
    updateData<NguoiDung>(`${API_URL.NGUOI_DUNG}/${id}`, data),

  /**
   * Xóa người dùng
   */
  delete: (id: number) => 
    deleteData(`${API_URL.NGUOI_DUNG}/${id}`),

};
