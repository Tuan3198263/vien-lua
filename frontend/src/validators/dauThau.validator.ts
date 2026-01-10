/**
 * Validation rules cho module Đấu Thầu
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Validator cho Đấu Thầu chính
 */
export const DAU_THAU_VALIDATOR = {
  de_tai_id: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Đề tài phải là số' },
  ] as Rule[],

  nam_thuc_hien: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Năm thực hiện phải là số' },
    { 
      type: 'number', 
      min: 1900, 
      message: 'Năm không hợp lệ' 
    },
  ] as Rule[],

  nguon_kinh_phi: [
    { max: 255, message: 'Nguồn kinh phí không được quá 255 ký tự' },
    { whitespace: true, message: 'Nguồn kinh phí không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  tong_kinh_phi: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Tổng kinh phí phải là số' },
    { 
      type: 'number', 
      min: 0, 
      message: 'Tổng kinh phí phải lớn hơn hoặc bằng 0' 
    },
  ] as Rule[],
};

/**
 * Validator cho Danh Sách Đấu Thầu
 */
export const DANH_SACH_DAU_THAU_VALIDATOR = {
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

  hinh_thuc: [
    { max: 255, message: 'Hình thức không được quá 255 ký tự' },
    { whitespace: true, message: 'Hình thức không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  buoc: [
    { max: 255, message: 'Bước không được quá 255 ký tự' },
    { whitespace: true, message: 'Bước không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  trang_thai: [
    { max: 255, message: 'Trạng thái không được quá 255 ký tự' },
    { whitespace: true, message: 'Trạng thái không được chỉ chứa khoảng trắng' },
  ] as Rule[],
};
