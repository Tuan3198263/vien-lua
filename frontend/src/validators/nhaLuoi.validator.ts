/**
 * Validation rules cho module Nhà Lưới
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Validator cho Nhà Lưới chính
 */
export const NHA_LUOI_VALIDATOR = {
  ten_nha_luoi: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 255, message: 'Tên nhà lưới không được quá 255 ký tự' },
    { whitespace: true, message: 'Tên nhà lưới không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  khu: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 50, message: 'Khu không được quá 50 ký tự' },
  ] as Rule[],

  so_be: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Số bể phải là số' },
    { type: 'number', min: 0, message: 'Số bể phải lớn hơn hoặc bằng 0' },
  ] as Rule[],

  dien_tich: [
     { required: true, message: MESSAGES.ERROR.REQUIRED },
   
  ] as Rule[],

  dia_diem: [
    { max: 255, message: 'Địa điểm không được quá 255 ký tự' },
  ] as Rule[],
};

/**
 * Validator cho Lần Sử Dụng
 */
export const LAN_SU_DUNG_VALIDATOR = {
  de_cuong_thi_nghiem_id: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', message: 'Đề cương thí nghiệm phải là số' },
  ] as Rule[],

  dung_cu: [
     { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 500, message: 'Dụng cụ không được quá 500 ký tự' },
    { whitespace: true, message: 'Dụng cụ không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  so_luong: [
     { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' },
  ] as Rule[],

  ngay_muon: [
     { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'date', message: 'Ngày mượn không hợp lệ' },
  ] as Rule[],

  ngay_tra: [
     { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'date', message: 'Ngày trả không hợp lệ' },
  ] as Rule[],

  khau_hao: [
     { required: true, message: MESSAGES.ERROR.REQUIRED },
   
  ] as Rule[],

  hien_trang: [
     { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 500, message: 'Hiện trạng không được quá 500 ký tự' },
  ] as Rule[],
};
