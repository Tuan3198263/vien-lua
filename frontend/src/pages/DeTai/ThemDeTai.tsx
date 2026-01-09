/**
 * Page Thêm Đề Tài
 * Route: /de-tai/them
 */

import { useState } from "react";
import { Form, Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderPageForm from "@/components/HeaderPageForm";
import FormDeTai from "./FormDeTai";
import { deTaiApi } from "@/services/api/deTaiApi";
import { notifyError, notifySuccess } from "@/utils/notification";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import type { DeTaiDto } from "@/interfaces";

/**
 * Component Page Thêm Đề Tài
 */
function ThemDeTai() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Xử lý khi submit form
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert dayjs to ISO string
      const submitData: DeTaiDto = {
        ...values,
        ngay_bat_dau: values.ngay_bat_dau?.format("YYYY-MM-DD"),
        ngay_ket_thuc: values.ngay_ket_thuc?.format("YYYY-MM-DD"),
      };

      setLoading(true);
      await deTaiApi.create(submitData);
      notifySuccess(SUCCESS_MESSAGES.CREATE);
      navigate("/de-tai");
    } catch (error: any) {
      console.error("Lỗi thêm đề tài:", error);
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      } else {
        const errorMsg =
          error.response?.data?.message || ERROR_MESSAGES.CREATE_FAILED;
        notifyError(ERROR_MESSAGES.CREATE_FAILED, errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <HeaderPageForm title="Thêm đề tài" backUrl="/de-tai" />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          backgroundColor: "#fff",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        <FormDeTai form={form} />

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

export default ThemDeTai;
