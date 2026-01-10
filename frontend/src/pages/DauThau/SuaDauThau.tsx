/**
 * Trang sửa Đấu Thầu
 */

import { useState, useEffect } from "react";
import { Button, Flex, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import HeaderPageForm from "@/components/HeaderPageForm";
import FormDauThau from "./FormDauThau";
import { DauThauDto } from "@/interfaces";
import { dauThauApi } from "@/services/api/dauThauApi";
import { notifySuccess, notifyError } from "@/utils/notification";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { useDocumentTitle } from "@/hooks";
import DanhSachDanhSachDauThau from "./DanhSachDauThau/DanhSachDanhSachDauThau";

/**
 * Component trang sửa Đấu Thầu
 */
function SuaDauThau() {
  useDocumentTitle();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  /**
   * Load dữ liệu ban đầu
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        const dauThau = await dauThauApi.getById(Number(id));

        const values = {
          de_tai_id: dauThau.de_tai_id,
          nam_thuc_hien: dauThau.nam_thuc_hien,
          nguon_kinh_phi: dauThau.nguon_kinh_phi,
          tong_kinh_phi: dauThau.tong_kinh_phi,
        };

        setInitialValues(values);
        form.setFieldsValue(values);
      } catch (error: any) {
        const message = error.response?.data?.message || error.message;
        notifyError("Lỗi tải dữ liệu", message);
        navigate(ROUTES.DAU_THAU);
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, form, navigate]);

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

      await dauThauApi.update(Number(id), data);
      notifySuccess(SUCCESS_MESSAGES.UPDATE);
      navigate(ROUTES.DAU_THAU);
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
        <HeaderPageForm title="Sửa đấu thầu" backUrl={ROUTES.DAU_THAU} />

        {/* Form chính */}
        <FormDauThau form={form} initialValues={initialValues} />

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
          <DanhSachDanhSachDauThau dauThauId={Number(id)} />
        </div>
      </div>
    </div>
  );
}

export default SuaDauThau;
