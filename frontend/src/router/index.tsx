/**
 * Router configuration
 * Cấu hình tất cả routes của ứng dụng
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import PrivateRoute from "@/components/PrivateRoute";
import DangNhap from "@/pages/DangNhap/DangNhap";
import TrangChu from "@/pages/TrangChu/TrangChu";
import NguoiDung from "@/pages/NguoiDung/NguoiDung";
import VaiTro from "@/pages/VaiTro/VaiTro";
import TaiLieu from "@/pages/TaiLieu/TaiLieu";
import HopDong from "@/pages/HopDong/HopDong";
import KhongCoQuyen from "@/pages/KhongCoQuyen/KhongCoQuyen";
import { ROUTES } from "@/constants/routes";

/**
 * Component định nghĩa tất cả routes
 */
function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.DANG_NHAP} element={<DangNhap />} />

      {/* Protected routes với MainLayout */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path={ROUTES.TRANG_CHU} element={<TrangChu />} />
        <Route path={ROUTES.NGUOI_DUNG} element={<NguoiDung />} />
        <Route path={ROUTES.VAI_TRO} element={<VaiTro />} />
        <Route path={ROUTES.TAI_LIEU} element={<TaiLieu />} />
        <Route path={ROUTES.HOP_DONG} element={<HopDong />} />
      </Route>

      {/* 403 page */}
      <Route path={ROUTES.KHONG_CO_QUYEN} element={<KhongCoQuyen />} />

      {/* Redirect mặc định */}
      <Route path="*" element={<Navigate to={ROUTES.TRANG_CHU} replace />} />
    </Routes>
  );
}

export default AppRouter;
