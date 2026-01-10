/**
 * Page Chi Tiết Đề Tài (Readonly)
 * Route: /de-tai/:id
 */

import { useState, useEffect } from "react";
import { Form, Flex, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import HeaderPageForm from "@/components/HeaderPageForm";
import FormDeTai from "./FormDeTai";
import DanhSachKinhPhiNam from "./KinhPhiNam/DanhSachKinhPhiNam";
import DanhSachSanPham from "./SanPham/DanhSachSanPham";
import DanhSachSanPhamThucTe from "./SanPhamThucTe/DanhSachSanPhamThucTe";
import DanhSachHoSoLuuTru from "./HoSoLuuTru/DanhSachHoSoLuuTru";
import {
  deTaiApi,
  kinhPhiNamApi,
  sanPhamApi,
  sanPhamThucTeApi,
  hoSoLuuTruApi,
} from "@/services/api/deTaiApi";
import { notifyError } from "@/utils/notification";
import type {
  DeTai,
  KinhPhiNam,
  SanPham,
  SanPhamThucTe,
  HoSoLuuTru,
} from "@/interfaces";

/**
 * Component Page Chi Tiết Đề Tài - Readonly
 */
function ChiTietDeTai() {
  const [form] = Form.useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const [deTai, setDeTai] = useState<DeTai | null>(null);
  const [kinhPhiList, setKinhPhiList] = useState<KinhPhiNam[]>([]);
  const [sanPhamList, setSanPhamList] = useState<SanPham[]>([]);
  const [sanPhamThucTeList, setSanPhamThucTeList] = useState<SanPhamThucTe[]>(
    []
  );
  const [hoSoList, setHoSoList] = useState<HoSoLuuTru[]>([]);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const deTaiId = Number(id);

  /**
   * Load dữ liệu đề tài và các sub-modules
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const deTaiData = await deTaiApi.getById(deTaiId);
        setDeTai(deTaiData);

        // Load sub-modules
        const [kinhPhi, sanPham, sanPhamThucTe, hoSo] = await Promise.all([
          kinhPhiNamApi.getAll(deTaiId),
          sanPhamApi.getAll(deTaiId),
          sanPhamThucTeApi.getAll(deTaiId),
          hoSoLuuTruApi.getAll(deTaiId),
        ]);

        setKinhPhiList(kinhPhi);
        setSanPhamList(sanPham);
        setSanPhamThucTeList(sanPhamThucTe);
        setHoSoList(hoSo);
      } catch (error: any) {
        notifyError("Lỗi tải dữ liệu", error.message);
        navigate("/de-tai");
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [deTaiId, navigate]);

  if (pageLoading) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}
      >
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          backgroundColor: "#fff",
          minHeight: "calc(100vh - 120px)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <HeaderPageForm title="Chi tiết đề tài" backUrl="/de-tai" />

        {/* Form chính - Disabled */}
        <FormDeTai form={form} initialValues={deTai} disabled />

        {/* Sub-modules - Readonly */}
        <div style={{ padding: "0 24px 24px" }}>
          <DanhSachKinhPhiNam dataSource={kinhPhiList} readonly />

          <DanhSachSanPham dataSource={sanPhamList} readonly />

          <DanhSachSanPhamThucTe dataSource={sanPhamThucTeList} readonly />

          <DanhSachHoSoLuuTru dataSource={hoSoList} readonly />
        </div>
      </div>
    </div>
  );
}

export default ChiTietDeTai;
