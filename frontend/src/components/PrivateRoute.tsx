/**
 * PrivateRoute Component
 * Bảo vệ các routes yêu cầu authentication
 */

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

interface PrivateRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

/**
 * Component bảo vệ route, yêu cầu đăng nhập
 * Có thể kiểm tra thêm quyền nếu cần
 */
function PrivateRoute({ children, requiredPermission }: PrivateRouteProps) {
  const { isAuthenticated, hasPermission } = useAuth();

  // Chưa đăng nhập -> redirect về trang login
  if (!isAuthenticated) {
    console.log("Chưa đăng nhập, redirect về /dang-nhap");
    return <Navigate to={ROUTES.DANG_NHAP} replace />;
  }

  // Kiểm tra quyền nếu cần
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log("Không có quyền truy cập:", requiredPermission);
    return <Navigate to={ROUTES.KHONG_CO_QUYEN} replace />;
  }

  // Đã đăng nhập và có quyền -> render component
  return <>{children}</>;
}

export default PrivateRoute;
