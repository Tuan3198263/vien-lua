/**
 * Danh Mục API Service
 * API để lấy dropdown options từ backend
 */

import { API_URL } from '@/config/api.config';
import axiosInstance from '../axios';

export interface DanhMucInfo {
  ma_danh_muc: string;
  ten_danh_muc: string;
  danh_sach_gia_tri: string[];
}

/**
 * API services cho danh mục
 */
export const danhMucApi = {
  /**
   * Lấy 1 danh mục theo mã
   */
  layTheoMa: async (ma: string): Promise<DanhMucInfo> => {
    const response = await axiosInstance.get(`${API_URL.DANH_MUC}/danh-muc/${ma}`);
    return response.data.data;
  },
};
