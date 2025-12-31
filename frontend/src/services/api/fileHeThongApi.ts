/**
 * File Hệ Thống API Service
 */

import { 
  FileHeThong,
  PaginationParams,
  PaginatedResponse 
} from '@/interfaces';
import { API_URL } from '@/config/api.config';
import { getData, getPaginatedData } from './coreApi';

/**
 * API services cho module File Hệ Thống
 */
export const fileHeThongApi = {
  /**
   * Lấy danh sách file có phân trang (kèm URL xem)
   * URL có hiệu lực 1 giờ
   */
  getAll: (params?: PaginationParams) => 
    getPaginatedData<FileHeThong>(API_URL.FILE_HE_THONG, params),

  /**
   * Lấy chi tiết file theo ID (kèm URL xem mới)
   */
  getById: (id: number) => 
    getData<FileHeThong>(`${API_URL.FILE_HE_THONG}/${id}`),

  /**
   * Lấy file theo module, bản ghi, trường
   * Dùng khi xem chi tiết bản ghi có file
   */
  getByQuery: (params: { 
    module: string; 
    ban_ghi_id: number; 
    ten_truong: string;
  }) => 
    getData<FileHeThong | null>(`${API_URL.FILE_HE_THONG}/lay-file`, params),
};
