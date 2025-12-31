/**
 * Vai Trò API Service
 */

import { 
  VaiTro, 
  VaiTroDto,
  PaginationParams
} from '@/interfaces';
import { API_URL } from '@/config/api.config';
import { getData, postData, updateData, deleteData, getPaginatedData } from './coreApi';

/**
 * API services cho module Vai Trò
 */
export const vaiTroApi = {
  /**
   * Lấy danh sách vai trò có phân trang
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<VaiTro>(API_URL.VAI_TRO, params),

  /**
   * Lấy chi tiết vai trò (kèm quyền)
   */
  getById: (id: number) => 
    getData<VaiTro>(`${API_URL.VAI_TRO}/${id}`),

  /**
   * Tạo vai trò mới (kèm quyền)
   */
  create: (data: VaiTroDto) => 
    postData<VaiTro>(API_URL.VAI_TRO, data),

  /**
   * Cập nhật vai trò (kèm quyền)
   */
  update: (id: number, data: VaiTroDto) => 
    updateData<VaiTro>(`${API_URL.VAI_TRO}/${id}`, data),

  /**
   * Xóa vai trò
   */
  delete: (id: number) => 
    deleteData(`${API_URL.VAI_TRO}/${id}`),

  /**
   * Lấy danh sách module của hệ thống
   * Dùng để hiển thị checkbox phân quyền
   */
  getModules: () => 
    getData<any[]>(`${API_URL.PHAN_QUYEN}/modules`),
};
