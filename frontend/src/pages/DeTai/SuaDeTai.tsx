/**
 * Page Sửa Đề Tài
 * Route: /de-tai/sua/:id
 */

import { useState, useEffect } from "react";
import { Form, Button, Flex, Spin } from "antd";
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
import { notifyError, notifySuccess } from "@/utils/notification";
import { SUCCESS_MESSAGES } from "@/constants/messages";
import type {
  DeTai,
  KinhPhiNam,
  SanPham,
  SanPhamThucTe,
  HoSoLuuTru,
} from "@/interfaces";

function SuaDeTai() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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

  /**
   * Xử lý submit form chính
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        ngay_bat_dau: values.ngay_bat_dau?.format("YYYY-MM-DD"),
        ngay_ket_thuc: values.ngay_ket_thuc?.format("YYYY-MM-DD"),
        kinh_phi_tong: Number(values.kinh_phi_tong),
      };

      setLoading(true);
      await deTaiApi.update(deTaiId, submitData);
      notifySuccess(SUCCESS_MESSAGES.UPDATE);
      navigate("/de-tai");
    } catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      } else {
        notifyError(
          "Thất bại",
          error.response?.data?.message || "Có lỗi xảy ra"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handlers cho Kinh Phí Năm
   */
  const handleAddKinhPhi = async (values: any) => {
    await kinhPhiNamApi.create(deTaiId, values);
    const updated = await kinhPhiNamApi.getAll(deTaiId);
    setKinhPhiList(updated);
    notifySuccess(SUCCESS_MESSAGES.CREATE);
  };

  const handleEditKinhPhi = async (id: number, values: any) => {
    await kinhPhiNamApi.update(deTaiId, id, values);
    const updated = await kinhPhiNamApi.getAll(deTaiId);
    setKinhPhiList(updated);
    notifySuccess(SUCCESS_MESSAGES.UPDATE);
  };

  const handleDeleteKinhPhi = async (id: number) => {
    await kinhPhiNamApi.delete(deTaiId, id);
    const updated = await kinhPhiNamApi.getAll(deTaiId);
    setKinhPhiList(updated);
    notifySuccess(SUCCESS_MESSAGES.DELETE);
  };

  /**
   * Handlers cho Sản Phẩm
   */
  const handleAddSanPham = async (values: any) => {
    await sanPhamApi.create(deTaiId, values);
    const updated = await sanPhamApi.getAll(deTaiId);
    setSanPhamList(updated);
    notifySuccess(SUCCESS_MESSAGES.CREATE);
  };

  const handleEditSanPham = async (id: number, values: any) => {
    await sanPhamApi.update(deTaiId, id, values);
    const updated = await sanPhamApi.getAll(deTaiId);
    setSanPhamList(updated);
    notifySuccess(SUCCESS_MESSAGES.UPDATE);
  };

  const handleDeleteSanPham = async (id: number) => {
    await sanPhamApi.delete(deTaiId, id);
    const updated = await sanPhamApi.getAll(deTaiId);
    setSanPhamList(updated);
    notifySuccess(SUCCESS_MESSAGES.DELETE);
  };

  /**
   * Handlers cho Sản Phẩm Thực Tế
   */
  const handleAddSanPhamThucTe = async (values: any) => {
    await sanPhamThucTeApi.create(deTaiId, values);
    const updated = await sanPhamThucTeApi.getAll(deTaiId);
    setSanPhamThucTeList(updated);
    notifySuccess(SUCCESS_MESSAGES.CREATE);
  };

  const handleEditSanPhamThucTe = async (id: number, values: any) => {
    await sanPhamThucTeApi.update(deTaiId, id, values);
    const updated = await sanPhamThucTeApi.getAll(deTaiId);
    setSanPhamThucTeList(updated);
    notifySuccess(SUCCESS_MESSAGES.UPDATE);
  };

  const handleDeleteSanPhamThucTe = async (id: number) => {
    await sanPhamThucTeApi.delete(deTaiId, id);
    const updated = await sanPhamThucTeApi.getAll(deTaiId);
    setSanPhamThucTeList(updated);
    notifySuccess(SUCCESS_MESSAGES.DELETE);
  };

  /**
   * Handlers cho Hồ Sơ Lưu Trữ
   */
  const handleAddHoSo = async (values: any, file?: File) => {
    await hoSoLuuTruApi.create(deTaiId, values, file);
    const updated = await hoSoLuuTruApi.getAll(deTaiId);
    setHoSoList(updated);
    notifySuccess(SUCCESS_MESSAGES.CREATE);
  };

  const handleEditHoSo = async (
    id: number,
    values: any,
    file?: File,
    deleteFile?: boolean
  ) => {
    await hoSoLuuTruApi.update(deTaiId, id, values, file, deleteFile);
    const updated = await hoSoLuuTruApi.getAll(deTaiId);
    setHoSoList(updated);
    notifySuccess(SUCCESS_MESSAGES.UPDATE);
  };

  const handleDeleteHoSo = async (id: number) => {
    await hoSoLuuTruApi.delete(deTaiId, id);
    const updated = await hoSoLuuTruApi.getAll(deTaiId);
    setHoSoList(updated);
    notifySuccess(SUCCESS_MESSAGES.DELETE);
  };

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
        <HeaderPageForm title="Sửa đề tài" backUrl="/de-tai" />

        {/* Form chính */}
        <FormDeTai form={form} initialValues={deTai} />

        {/* Sub-modules */}
        <div style={{ padding: "0 24px 24px" }}>
          <DanhSachKinhPhiNam
            dataSource={kinhPhiList}
            onAdd={handleAddKinhPhi}
            onEdit={handleEditKinhPhi}
            onDelete={handleDeleteKinhPhi}
          />

          <DanhSachSanPham
            dataSource={sanPhamList}
            onAdd={handleAddSanPham}
            onEdit={handleEditSanPham}
            onDelete={handleDeleteSanPham}
          />

          <DanhSachSanPhamThucTe
            dataSource={sanPhamThucTeList}
            onAdd={handleAddSanPhamThucTe}
            onEdit={handleEditSanPhamThucTe}
            onDelete={handleDeleteSanPhamThucTe}
          />

          <DanhSachHoSoLuuTru
            dataSource={hoSoList}
            onAdd={handleAddHoSo}
            onEdit={handleEditHoSo}
            onDelete={handleDeleteHoSo}
          />
        </div>

        {/* Action Buttons */}
        <Flex
          justify="flex-end"
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f0f0f0",
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff",
          }}
        >
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Lưu
          </Button>
        </Flex>
      </div>
    </div>
  );
}

export default SuaDeTai;
