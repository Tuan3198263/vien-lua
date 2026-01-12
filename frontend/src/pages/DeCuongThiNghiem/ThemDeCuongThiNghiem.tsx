/**
 * Trang thêm mới Đề Cương Thí Nghiệm
 */

import { useState } from "react";
import { Form, Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderPageForm from "@/components/HeaderPageForm";
import FormDeCuongThiNghiem from "./FormDeCuongThiNghiem";
import { DeCuongThiNghiemDto } from "@/interfaces";
import { deCuongThiNghiemApi } from "@/services/api/deCuongThiNghiemApi";
import { notifySuccess, notifyError } from "@/utils/notification";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { useDocumentTitle } from "@/hooks";

/**
 * Component trang thêm Đề Cương Thí Nghiệm
 */
function ThemDeCuongThiNghiem() {
  useDocumentTitle();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  /**
   * Xử lý thay đổi file
   */
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
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

      await deCuongThiNghiemApi.create(data, file || undefined);
      notifySuccess(SUCCESS_MESSAGES.CREATE);
      navigate(ROUTES.DE_CUONG_THI_NGHIEM);
    } catch (error: any) {
      if (error.errorFields) {
        // Validation error
        notifyError(ERROR_MESSAGES.REQUIRED, error.errorFields[0].errors[0]);
      } else {
        // API error
        const message = error.response?.data?.message || error.message;
        notifyError(ERROR_MESSAGES.CREATE_FAILED, message);
      }
    } finally {
      setLoading(false);
    }
  };

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
          title="Thêm đề cương thí nghiệm"
          backUrl={ROUTES.DE_CUONG_THI_NGHIEM}
        />

        <FormDeCuongThiNghiem form={form} onFileChange={handleFileChange} />

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

export default ThemDeCuongThiNghiem;
