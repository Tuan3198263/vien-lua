/**
 * Trang thêm mới Đấu Thầu
 */

import { useState } from "react";
import { Form, Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderPageForm from "@/components/HeaderPageForm";
import FormDauThau from "./FormDauThau";
import { DauThauDto } from "@/interfaces";
import { dauThauApi } from "@/services/api/dauThauApi";
import { notifySuccess, notifyError } from "@/utils/notification";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { useDocumentTitle } from "@/hooks";

/**
 * Component trang thêm Đấu Thầu
 */
function ThemDauThau() {
  useDocumentTitle();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /**
   * Xử lý submit form
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const data: DauThauDto = {
        de_tai_id: values.de_tai_id,
        nam_thuc_hien: values.nam_thuc_hien,
        nguon_kinh_phi: values.nguon_kinh_phi,
        tong_kinh_phi: Number(values.tong_kinh_phi),
      };

      await dauThauApi.create(data);
      notifySuccess(SUCCESS_MESSAGES.CREATE);
      navigate(ROUTES.DAU_THAU);
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
        <HeaderPageForm title="Thêm đấu thầu" backUrl={ROUTES.DAU_THAU} />

        <FormDauThau form={form} />

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

export default ThemDauThau;
