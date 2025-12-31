/**
 * Validation rules cho module Người Dùng
 * Mirror từ backend để đảm bảo đồng bộ
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Validation rules cho người dùng
 * Đồng bộ với backend validation
 */
export const NGUOI_DUNG_RULES = {
  /**
   * Tài khoản: Bắt buộc, 3-50 ký tự
   */
  tai_khoan: [
    { required: true,message: MESSAGES.ERROR.REQUIRED },
    { min: 3, message: 'Tài khoản phải có ít nhất 3 ký tự' },
    { max: 50, message: 'Tài khoản không được quá 50 ký tự' },
  ] as Rule[],

  /**
   * Họ tên: Bắt buộc, tối đa 100 ký tự
   */
  ho_ten: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { max: 100, message: 'Họ tên không được quá 100 ký tự' },
  ] as Rule[],

  /**
   * Email: Bắt buộc, đúng định dạng, tối đa 100 ký tự
   */
  email: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'email' as const, message: 'Email không đúng định dạng' },
    { max: 100, message: 'Email không được quá 100 ký tự' },
  ] as Rule[],

  /**
   * Mật khẩu: Bắt buộc, tối thiểu 6 ký tự
   */
  mat_khau: [
    { required: true,message: MESSAGES.ERROR.REQUIRED },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
  ] as Rule[],

  /**
   * Số điện thoại: Tùy chọn, tối đa 20 ký tự
   */
  sdt: [
    { max: 20, message: 'Số điện thoại không được quá 20 ký tự' },
  ] as Rule[],

  /**
   * Vai trò: Bắt buộc
   */
  vai_tro_id: [
    { required: true, message: 'Vui lòng chọn vai trò' },
  ] as Rule[],

  /**
   * Địa chỉ: Tùy chọn, tối đa 255 ký tự
   */
  dia_chi: [
    { max: 255, message: 'Địa chỉ không được quá 255 ký tự' },
  ] as Rule[],

  /**
   * Ghi chú: Tùy chọn, tối đa 255 ký tự
   */
  ghi_chu: [
    { max: 255, message: 'Ghi chú không được quá 255 ký tự' },
  ] as Rule[],
};
