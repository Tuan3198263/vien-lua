/**
 * Validation rules cho module Người Dùng
 * Mirror từ backend DTOs
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Validation rules cho người dùng
 */
export const NGUOI_DUNG_RULES = {
  tai_khoan: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { min: 3, message: 'Tài khoản phải có ít nhất 3 ký tự' },
    { max: 50, message: 'Tài khoản không được quá 50 ký tự' },
  ] as Rule[],

  ho_ten: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 100, message: 'Họ tên không được quá 100 ký tự' },
  ] as Rule[],

  email: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'email' as const, message: 'Email không hợp lệ' },
    { max: 100, message: 'Email không được quá 100 ký tự' },
  ] as Rule[],

  mat_khau: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
  ] as Rule[],

  sdt: [
    { max: 20, message: 'Số điện thoại không được quá 20 ký tự' },
  ] as Rule[],
};
