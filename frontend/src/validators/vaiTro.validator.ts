/**
 * Validation rules cho module Vai Trò
 * Đồng bộ với backend entity và DTOs
 */

import type { Rule } from 'antd/es/form';
import { MESSAGES } from '@/constants/messages';

/**
 * Rules cho form tạo/sửa vai trò
 * Sync với CreateVaiTroDto và UpdateVaiTroDto
 */
export const VAI_TRO_RULES = {
  /**
   * Mã vai trò (ADMIN, USER, MANAGER...)
   * Backend: varchar(50), NOT NULL, UNIQUE
   */
  ma_vai_tro: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'string' as const, message: 'Mã vai trò phải là chuỗi' },
    { max: 50, message: 'Mã vai trò không được vượt quá 50 ký tự' },
    { whitespace: true, message: 'Mã vai trò không được chỉ chứa khoảng trắng' },
    {
      pattern: /^[A-Z_]+$/,
      message: 'Mã vai trò chỉ được chứa chữ in hoa và dấu gạch dưới',
    },
  ] as Rule[],

  /**
   * Tên vai trò hiển thị
   * Backend: varchar(100), NOT NULL
   */
  ten_vai_tro: [
    { required: true, message: MESSAGES.ERROR.REQUIRED },
    { type: 'string' as const, message: 'Tên vai trò phải là chuỗi' },
    { max: 100, message: 'Tên vai trò không được vượt quá 100 ký tự' },
    { whitespace: true, message: 'Tên vai trò không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  /**
   * Mô tả vai trò
   * Backend: text, NULLABLE
   */
  mo_ta: [
    { type: 'string' as const, message: 'Mô tả phải là chuỗi' },
  ] as Rule[],

  /**
   * Danh sách quyền (permissions)
   * Backend: QuyenModuleDto[], NULLABLE
   */
  permissions: [] as Rule[], // Không validate ở form level, validate ở API
};

/**
 * Rules cho form tạo mới vai trò
 */
export const CREATE_VAI_TRO_RULES = {
  ...VAI_TRO_RULES,
};

/**
 * Rules cho form cập nhật vai trò
 * Tất cả optional trừ khi có giá trị
 */
export const UPDATE_VAI_TRO_RULES = {
  ma_vai_tro: [
    { type: 'string' as const, message: 'Mã vai trò phải là chuỗi' },
    { max: 50, message: 'Mã vai trò không được vượt quá 50 ký tự' },
    { whitespace: true, message: 'Mã vai trò không được chỉ chứa khoảng trắng' },
    {
      pattern: /^[A-Z_]+$/,
      message: 'Mã vai trò chỉ được chứa chữ in hoa và dấu gạch dưới',
    },
  ] as Rule[],

  ten_vai_tro: [
    { type: 'string' as const, message: 'Tên vai trò phải là chuỗi' },
    { max: 100, message: 'Tên vai trò không được vượt quá 100 ký tự' },
    { whitespace: true, message: 'Tên vai trò không được chỉ chứa khoảng trắng' },
  ] as Rule[],

  mo_ta: VAI_TRO_RULES.mo_ta,
  permissions: VAI_TRO_RULES.permissions,
};
