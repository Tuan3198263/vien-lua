/**
 * Validation rules cho module Đề Tài
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Validator cho Đề Tài chính
 */
export const DE_TAI_VALIDATOR = {
  ten_de_tai: [
    { required: true,  message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Tên đề tài không được quá 255 ký tự' },
    { whitespace: true, message: 'Tên đề tài không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  ma_de_tai: [
    { max: 100,  message: MESSAGES.ERROR.REQUIRED},
    { whitespace: true, message: 'Mã đề tài không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  don_vi_phe_duyet: [
    { required: true,  message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Đơn vị phê duyệt không được quá 255 ký tự' },
    { whitespace: true, message: 'Đơn vị phê duyệt không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  cap_quan_ly_de_tai: [
    { required: true,  message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Cấp quản lý đề tài không được quá 255 ký tự' },
    { whitespace: true, message: 'Cấp quản lý đề tài không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  ngay_bat_dau: [
    { required: true,  message: MESSAGES.ERROR.REQUIRED },
  ] as Rule[],

  ngay_ket_thuc: [
    { required: true,  message: MESSAGES.ERROR.REQUIRED },
  ] as Rule[],

  phuong_thuc_khoang_chi: [
    { max: 255, message: 'Phương thức khoáng chi không được quá 255 ký tự' },
  ] as Rule[],

  linh_vuc_khoa_hoc: [
    { max: 255, message: 'Lĩnh vực khoa học không được quá 255 ký tự' },
  ] as Rule[],

  nguon_goc_de_tai: [
    { max: 255, message: 'Nguồn gốc đề tài không được quá 255 ký tự' },
  ] as Rule[],

  hop_dong: [
    { max: 255, message: 'Hợp đồng không được quá 255 ký tự' },
  ] as Rule[],

  bien_ban_thanh_ly: [
    { max: 255, message: 'Biên bản thanh lý không được quá 255 ký tự' },
  ] as Rule[],

  chu_nhiem_de_tai: [
    { required: true,  message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Chủ nhiệm đề tài không được quá 255 ký tự' },
    { whitespace: true, message: 'Chủ nhiệm đề tài không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  thu_ky_de_tai: [
    { required: true,  message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Thư ký đề tài không được quá 255 ký tự' },
    { whitespace: true, message: 'Thư ký đề tài không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  kinh_phi_tong: [
    { required: true,  message: MESSAGES.ERROR.REQUIRED },
   
  ] as Rule[],
};

/**
 * Validator cho Kinh Phí Năm
 */
export const KINH_PHI_NAM_VALIDATOR = {
  nam: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Năm phải là số' },
    { 
      type: 'number', 
      min: 1900, 
      message: 'Năm không hợp lệ' 
    },
  ] as Rule[],

  kinh_phi: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Kinh phí phải là số' },
    { 
      type: 'number', 
      min: 0, 
      message: 'Kinh phí phải lớn hơn hoặc bằng 0' 
    },
  ] as Rule[],
};

/**
 * Validator cho Sản Phẩm Dự Kiến
 */
export const SAN_PHAM_VALIDATOR = {
  ten_san_pham: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Tên sản phẩm không được quá 255 ký tự' },
    { whitespace: true, message: 'Tên sản phẩm không được chỉ chứa khoảng trắng' },
  ] as Rule[],
};

/**
 * Validator cho Sản Phẩm Thực Tế
 */
export const SAN_PHAM_THUC_TE_VALIDATOR = {
  ten_san_pham: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Tên sản phẩm không được quá 255 ký tự' },
    { whitespace: true, message: 'Tên sản phẩm không được chỉ chứa khoảng trắng' },
  ] as Rule[],
};

/**
 * Validator cho Hồ Sơ Lưu Trữ
 */
export const HO_SO_LUU_TRU_VALIDATOR = {
  loai_ho_so: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Loại hồ sơ không được quá 255 ký tự' },
    { whitespace: true, message: 'Loại hồ sơ không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  nam: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Năm phải là số' },
    { 
      type: 'number', 
      min: 1900, 
      message: 'Năm không hợp lệ' 
    },
  ] as Rule[],
};
