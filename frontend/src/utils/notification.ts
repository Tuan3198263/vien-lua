/**
 * Cấu hình notification chung cho toàn ứng dụng
 * Sử dụng Ant Design notification
 */

import { notification } from 'antd';

/**
 * Cấu hình notification mặc định
 */
notification.config({
  placement: 'topRight',
  top: 24,
  duration: 3,
  maxCount: 3,
});

/**
 * Hiển thị notification thành công
 */
export const notifySuccess = (message: string, description?: string) => {
  notification.success({
    message,
    description,
  });
};

/**
 * Hiển thị notification lỗi
 */
export const notifyError = (message: string, description?: string) => {
  notification.error({
    message,
    description,
  });
};

/**
 * Hiển thị notification cảnh báo
 */
export const notifyWarning = (message: string, description?: string) => {
  notification.warning({
    message,
    description,
  });
};

/**
 * Hiển thị notification thông tin
 */
export const notifyInfo = (message: string, description?: string) => {
  notification.info({
    message,
    description,
  });
};

export default {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
};
