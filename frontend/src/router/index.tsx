/**
 * Router configuration
 * Cấu hình tất cả routes của ứng dụng với Lazy Loading
 */

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { MainLayout } from "@/layouts/MainLayout";
import PrivateRoute from "@/components/PrivateRoute";
import { ROUTES } from "@/constants/routes";

// Lazy load components - Load khi cần thay vì load tất cả lúc đầu
const DangNhap = lazy(() => import("@/pages/DangNhap/DangNhap"));
const TrangChu = lazy(() => import("@/pages/TrangChu/TrangChu"));
const NguoiDung = lazy(() => import("@/pages/NguoiDung/NguoiDung"));
const VaiTro = lazy(() => import("@/pages/VaiTro/VaiTro"));
const TaiLieu = lazy(() => import("@/pages/TaiLieu/TaiLieu"));
const HopDong = lazy(() => import("@/pages/HopDong/HopDong"));
const DeTai = lazy(() => import("@/pages/DeTai/DeTai"));
const ThemDeTai = lazy(() => import("@/pages/DeTai/ThemDeTai"));
const SuaDeTai = lazy(() => import("@/pages/DeTai/SuaDeTai"));
const ChiTietDeTai = lazy(() => import("@/pages/DeTai/ChiTietDeTai"));
const DauThau = lazy(() => import("@/pages/DauThau/DauThau"));
const ThemDauThau = lazy(() => import("@/pages/DauThau/ThemDauThau"));
const SuaDauThau = lazy(() => import("@/pages/DauThau/SuaDauThau"));
const DeCuongThiNghiem = lazy(
  () => import("@/pages/DeCuongThiNghiem/DeCuongThiNghiem")
);
const ThemDeCuongThiNghiem = lazy(
  () => import("@/pages/DeCuongThiNghiem/ThemDeCuongThiNghiem")
);
const SuaDeCuongThiNghiem = lazy(
  () => import("@/pages/DeCuongThiNghiem/SuaDeCuongThiNghiem")
);
const NhaLuoi = lazy(() => import("@/pages/NhaLuoi/NhaLuoi"));
const ThemNhaLuoi = lazy(() => import("@/pages/NhaLuoi/ThemNhaLuoi"));
const SuaNhaLuoi = lazy(() => import("@/pages/NhaLuoi/SuaNhaLuoi"));
const DongRuong = lazy(() => import("@/pages/DongLua/DongRuong"));
const KhongCoQuyen = lazy(() => import("@/pages/KhongCoQuyen/KhongCoQuyen"));

// Loading fallback component
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Spin size="large" tip="Đang tải..." />
  </div>
);

/**
 * Component định nghĩa tất cả routes
 */
function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
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

          {/* ====== NHÀ LƯỚI (nested routes) ====== */}
          <Route path={ROUTES.NHA_LUOI}>
            <Route index element={<NhaLuoi />} /> {/* /nha-luoi */}
            <Route path="them" element={<ThemNhaLuoi />} />{" "}
            {/* /nha-luoi/them */}
            <Route path="sua/:id" element={<SuaNhaLuoi />} />{" "}
            {/* /nha-luoi/sua/:id */}
          </Route>

          {/* ====== ĐỀ TÀI (nested routes) ====== */}
          <Route path={ROUTES.DE_TAI}>
            <Route index element={<DeTai />} /> {/* /de-tai */}
            <Route path="them" element={<ThemDeTai />} /> {/* /de-tai/them */}
            <Route path="sua/:id" element={<SuaDeTai />} />{" "}
            {/* /de-tai/sua/:id */}
            <Route path=":id" element={<ChiTietDeTai />} /> {/* /de-tai/:id */}
          </Route>

          {/* ====== ĐẤU THẦU (nested routes) ====== */}
          <Route path={ROUTES.DAU_THAU}>
            <Route index element={<DauThau />} /> {/* /dau-thau */}
            <Route path="them" element={<ThemDauThau />} />{" "}
            {/* /dau-thau/them */}
            <Route path="sua/:id" element={<SuaDauThau />} />{" "}
            {/* /dau-thau/sua/:id */}
          </Route>

          {/* ====== ĐỀ CƯƠNG THÍ NGHIỆM (nested routes) ====== */}
          <Route path={ROUTES.DE_CUONG_THI_NGHIEM}>
            <Route index element={<DeCuongThiNghiem />} />{" "}
            {/* /de-cuong-thi-nghiem */}
            <Route path="them" element={<ThemDeCuongThiNghiem />} />{" "}
            {/* /de-cuong-thi-nghiem/them */}
            <Route path="sua/:id" element={<SuaDeCuongThiNghiem />} />{" "}
            {/* /de-cuong-thi-nghiem/sua/:id */}
          </Route>

          {/* ====== ĐỒNG RUỘNG ====== */}
          <Route path={ROUTES.DONG_RUONG} element={<DongRuong />} />
        </Route>

        {/* 403 page */}
        <Route path={ROUTES.KHONG_CO_QUYEN} element={<KhongCoQuyen />} />

        {/* Redirect mặc định */}
        <Route path="*" element={<Navigate to={ROUTES.TRANG_CHU} replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
