/**
 * Phân Quyền API Service
 */

import { 
  PhanQuyen, 
  GanQuyenDto,
  ModuleHeThong,
  PaginationParams 
} from '@/interfaces';
import { API_URL } from '@/config/api.config';
import { getData, postData, deleteData, getPaginatedData } from './coreApi';

/**
 * API services cho module Phân Quyền
 */
export const phanQuyenApi = {
  /**
   * Lấy danh sách phân quyền
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<PhanQuyen>(API_URL.PHAN_QUYEN, params),

  /**
   * Gán quyền cho vai trò
   */
  ganQuyen: (data: GanQuyenDto) => 
    postData(`${API_URL.PHAN_QUYEN}/gan-quyen`, data),

  /**
   * Lấy quyền của vai trò
   */
  layQuyenCuaVaiTro: (idVaiTro: number) => 
    getData<PhanQuyen[]>(`${API_URL.PHAN_QUYEN}/vai-tro/${idVaiTro}`),

  /**
   * Xóa quyền
   */
  xoaQuyen: (id: number) => 
    deleteData(`${API_URL.PHAN_QUYEN}/${id}`),

  /**
   * Lấy danh sách module hệ thống
   */
  getDanhSachModule: () => 
    getData<ModuleHeThong[]>(API_URL.MODULE_HE_THONG),
};
