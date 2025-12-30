/**
 * Validation utilities - Các hàm validate
 */

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate số điện thoại Việt Nam
 */
export const isValidPhone = (phone: string): boolean => {
  // Phone VN: 10 số, bắt đầu bằng 0
  const phoneRegex = /^0[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password (ít nhất 6 ký tự)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate password mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số)
 */
export const isStrongPassword = (password: string): boolean => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongRegex.test(password);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate số
 */
export const isNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate số dương
 */
export const isPositiveNumber = (value: any): boolean => {
  return isNumber(value) && parseFloat(value) > 0;
};

/**
 * Validate tài khoản (chỉ chữ, số, gạch dưới, 3-20 ký tự)
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Kiểm tra chuỗi rỗng
 */
export const isEmpty = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};
