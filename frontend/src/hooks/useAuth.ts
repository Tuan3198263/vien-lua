/**
 * useAuth hook - Hook để lấy thông tin authentication
 */

import { useAppSelector } from './useRedux';
import { AuthUser } from '@/interfaces';

/**
 * Hook để lấy thông tin auth từ Redux store
 */
export const useAuth = () => {
  const { user, accessToken, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Kiểm tra user có quyền hay không
   * @param permission - Permission string (format: "MODULE:ACTION")
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  /**
   * Kiểm tra user có một trong các quyền
   * @param permissions - Mảng permission strings
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some((permission) => user.permissions?.includes(permission));
  };

  /**
   * Kiểm tra user có tất cả các quyền
   * @param permissions - Mảng permission strings
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.every((permission) => user.permissions?.includes(permission));
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
