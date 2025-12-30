/**
 * Validation rules cho authentication
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Validation rules cho đăng nhập
 */
export const LOGIN_VALIDATOR = {
  tai_khoan: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { min: 3, message: 'Tài khoản phải có ít nhất 3 ký tự' },
    { max: 50, message: 'Tài khoản không được quá 50 ký tự' },
    { whitespace: true, message: 'Tài khoản không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  mat_khau: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
    { whitespace: true, message: 'Mật khẩu không được chỉ chứa khoảng trắng' },
  ] as Rule[],
};
