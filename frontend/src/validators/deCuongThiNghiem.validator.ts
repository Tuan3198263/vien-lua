/**
 * Validation rules cho module Đề Cương Thí Nghiệm
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Validator cho Đề Cương Thí Nghiệm chính
 */
export const DE_CUONG_THI_NGHIEM_VALIDATOR = {
  de_tai_id: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Đề tài phải là số' },
  ] as Rule[],

  ten_thi_nghiem: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Tên thí nghiệm không được quá 255 ký tự' },
    { whitespace: true, message: 'Tên thí nghiệm không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  loai_hinh_thi_nghiem: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Loại hình thí nghiệm không được quá 255 ký tự' },
    { whitespace: true, message: 'Loại hình thí nghiệm không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  ngay_bat_dau: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
  ] as Rule[],

  ngay_ket_thuc: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
  ] as Rule[],

  mua_vu: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Mùa vụ không được quá 255 ký tự' },
    { whitespace: true, message: 'Mùa vụ không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  nguoi_thuc_hien: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Người thực hiện không được quá 255 ký tự' },
    { whitespace: true, message: 'Người thực hiện không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  kinh_phi_ky_thuat: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
   
  ] as Rule[],

  kinh_phi_lao_dong: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
   
  ] as Rule[],

  kinh_phi_nguyen_vat_lieu: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
  
  ] as Rule[],
};

/**
 * Validator cho Danh Sách Số Lượng Thí Nghiệm
 */
export const DANH_SACH_SO_LUONG_THI_NGHIEM_VALIDATOR = {
  dia_diem: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Địa điểm không được quá 255 ký tự' },
    { whitespace: true, message: 'Địa điểm không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  vi_tri: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Vị trí không được quá 255 ký tự' },
    { whitespace: true, message: 'Vị trí không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  dien_tich: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', min: 0, message: 'Diện tích phải là số lớn hơn hoặc bằng 0' },
  ] as Rule[],
};
