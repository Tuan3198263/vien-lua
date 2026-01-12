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
import DeTai from "@/pages/DeTai/DeTai";
import ThemDeTai from "@/pages/DeTai/ThemDeTai";
import SuaDeTai from "@/pages/DeTai/SuaDeTai";
import ChiTietDeTai from "@/pages/DeTai/ChiTietDeTai";
import DauThau from "@/pages/DauThau/DauThau";
import ThemDauThau from "@/pages/DauThau/ThemDauThau";
import SuaDauThau from "@/pages/DauThau/SuaDauThau";
import DeCuongThiNghiem from "@/pages/DeCuongThiNghiem/DeCuongThiNghiem";
import ThemDeCuongThiNghiem from "@/pages/DeCuongThiNghiem/ThemDeCuongThiNghiem";
import SuaDeCuongThiNghiem from "@/pages/DeCuongThiNghiem/SuaDeCuongThiNghiem";
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
          <Route path="them" element={<ThemDauThau />} /> {/* /dau-thau/them */}
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
      </Route>

      {/* 403 page */}
      <Route path={ROUTES.KHONG_CO_QUYEN} element={<KhongCoQuyen />} />

      {/* Redirect mặc định */}
      <Route path="*" element={<Navigate to={ROUTES.TRANG_CHU} replace />} />
    </Routes>
  );
}

export default AppRouter;
