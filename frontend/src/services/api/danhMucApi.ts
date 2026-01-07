/**
 * Danh Mục API Service
 * API để lấy dropdown options từ backend
 */

import { API_URL } from '@/config/api.config';
import axiosInstance from '../axios';

export interface DanhMucInfo {
  ma_danh_muc: string;
  ten_danh_muc: string;
  module?: string | null;
  danh_sach_gia_tri: string[];
}

/**
 * API services cho danh mục
 */
export const danhMucApi = {
  /**
   * Lấy tất cả danh mục
   */
  layTatCa: async (): Promise<DanhMucInfo[]> => {
    const response = await axiosInstance.get(`${API_URL.DANH_MUC}/danh-muc`);
    return response.data.data;
  },

  /**
   * Lấy 1 danh mục theo mã
   */
  layTheoMa: async (ma: string): Promise<DanhMucInfo> => {
    const response = await axiosInstance.get(`${API_URL.DANH_MUC}/danh-muc/ma/${ma}`);
    return response.data.data;
  },

  /**
   * Lấy nhiều danh mục cùng lúc
   */
  layNhieu: async (maDanhMucs: string[]): Promise<DanhMucInfo[]> => {
    const response = await axiosInstance.post(`${API_URL.DANH_MUC}/danh-muc/lay-nhieu`, {
      ma_danh_muc: maDanhMucs,
    });
    return response.data.data;
  },

  /**
   * Lấy tất cả danh mục của 1 module
   */
  layTheoModule: async (module: string): Promise<DanhMucInfo[]> => {
    const response = await axiosInstance.get(`${API_URL.DANH_MUC}/danh-muc/module/${module}`);
    return response.data.data;
  },
};
