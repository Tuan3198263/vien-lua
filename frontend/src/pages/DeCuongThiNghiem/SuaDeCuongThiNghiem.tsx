/**
 * Trang sửa Đề Cương Thí Nghiệm
 */

import { useState, useEffect } from "react";
import { Button, Flex, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import HeaderPageForm from "@/components/HeaderPageForm";
import FormDeCuongThiNghiem from "./FormDeCuongThiNghiem";
import { DeCuongThiNghiemDto } from "@/interfaces";
import { deCuongThiNghiemApi } from "@/services/api/deCuongThiNghiemApi";
import { notifySuccess, notifyError } from "@/utils/notification";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { useDocumentTitle } from "@/hooks";
import DanhSachSoLuongThiNghiem from "./DanhSachSoLuongThiNghiem/DanhSachSoLuongThiNghiem";
import dayjs from "dayjs";

/**
 * Component trang sửa Đề Cương Thí Nghiệm
 */
function SuaDeCuongThiNghiem() {
  useDocumentTitle();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [existingFile, setExistingFile] = useState<any>(null);

  // File handling
  const [file, setFile] = useState<File | null>(null);
  const [deleteFile, setDeleteFile] = useState(false);

  /**
   * Load dữ liệu ban đầu
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        const deCuong = await deCuongThiNghiemApi.getById(Number(id));

        const values = {
          de_tai_id: deCuong.de_tai_id,
          ten_thi_nghiem: deCuong.ten_thi_nghiem,
          loai_hinh_thi_nghiem: deCuong.loai_hinh_thi_nghiem,
          ngay_bat_dau: dayjs(deCuong.ngay_bat_dau),
          ngay_ket_thuc: dayjs(deCuong.ngay_ket_thuc),
          nguoi_thuc_hien: deCuong.nguoi_thuc_hien,
          mua_vu: deCuong.mua_vu,
          kinh_phi_ky_thuat: deCuong.kinh_phi_ky_thuat,
          kinh_phi_lao_dong: deCuong.kinh_phi_lao_dong,
          kinh_phi_nguyen_vat_lieu: deCuong.kinh_phi_nguyen_vat_lieu,
        };

        setInitialValues(values);

        // Set existing file
        if (deCuong.file_de_cuong) {
          setExistingFile(deCuong.file_de_cuong);
        }

        form.setFieldsValue(values);
      } catch (error: any) {
        const message = error.response?.data?.message || error.message;
        notifyError("Lỗi tải dữ liệu", message);
        navigate(ROUTES.DE_CUONG_THI_NGHIEM);
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, form, navigate]);

  /**
   * Xử lý thay đổi file
   */
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setDeleteFile(false); // Reset deleteFile khi chọn file mới
  };

  /**
   * Xử lý xóa file hiện tại
   */
  const handleDeleteFileChange = (shouldDelete: boolean) => {
    setDeleteFile(shouldDelete);
    setFile(null); // Reset file khi xóa file hiện tại
  };

  /**
   * Xử lý submit form
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const data: DeCuongThiNghiemDto = {
        de_tai_id: values.de_tai_id,
        ten_thi_nghiem: values.ten_thi_nghiem,
        loai_hinh_thi_nghiem: values.loai_hinh_thi_nghiem,
        ngay_bat_dau: values.ngay_bat_dau.format("YYYY-MM-DD"),
        ngay_ket_thuc: values.ngay_ket_thuc.format("YYYY-MM-DD"),
        nguoi_thuc_hien: values.nguoi_thuc_hien,
        mua_vu: values.mua_vu,
        kinh_phi_ky_thuat: Number(values.kinh_phi_ky_thuat),
        kinh_phi_lao_dong: Number(values.kinh_phi_lao_dong),
        kinh_phi_nguyen_vat_lieu: Number(values.kinh_phi_nguyen_vat_lieu),
      };

      await deCuongThiNghiemApi.update(
        Number(id),
        data,
        file || undefined,
        deleteFile
      );
      notifySuccess(SUCCESS_MESSAGES.UPDATE);
      navigate(ROUTES.DE_CUONG_THI_NGHIEM);
    } catch (error: any) {
      if (error.errorFields) {
        // Validation error
        notifyError(ERROR_MESSAGES.REQUIRED, error.errorFields[0].errors[0]);
      } else {
        // API error
        const message = error.response?.data?.message || error.message;
        notifyError(ERROR_MESSAGES.UPDATE_FAILED, message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
        <HeaderPageForm
          title="Sửa đề cương thí nghiệm"
          backUrl={ROUTES.DE_CUONG_THI_NGHIEM}
        />

        {/* Form chính */}
        <FormDeCuongThiNghiem
          form={form}
          initialValues={initialValues}
          onFileChange={handleFileChange}
          onDeleteFileChange={handleDeleteFileChange}
          existingFile={existingFile}
        />

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

        {/* Sub-modules */}
        <div style={{ padding: "0 24px 24px" }}>
          <DanhSachSoLuongThiNghiem deCuongId={Number(id)} />
        </div>
      </div>
    </div>
  );
}

export default SuaDeCuongThiNghiem;
