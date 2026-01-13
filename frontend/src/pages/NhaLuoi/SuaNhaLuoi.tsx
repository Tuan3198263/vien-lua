/**
 * Sửa Nhà Lưới - Page Component
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Form, Flex } from "antd";
import { notifySuccess, notifyError } from "@/utils/notification";
import { nhaLuoiApi } from "@/services/api/nhaLuoiApi";
import { NhaLuoiDto } from "@/interfaces";
import { ROUTES } from "@/constants/routes";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { useDocumentTitle } from "@/hooks";
import HeaderPageForm from "@/components/HeaderPageForm";
import FormNhaLuoi from "./FormNhaLuoi";
import DanhSachLanSuDung from "./LanSuDung/DanhSachLanSuDung";

function SuaNhaLuoi() {
  useDocumentTitle();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadData(Number(id));
    }
  }, [id]);

  const loadData = async (nhaLuoiId: number) => {
    try {
      setInitialLoading(true);
      const data = await nhaLuoiApi.getById(nhaLuoiId);
      const values = {
        ten_nha_luoi: data.ten_nha_luoi,
        khu: data.khu,
        so_be: data.so_be,
        dien_tich: data.dien_tich,
        dia_diem: data.dia_diem,
      };
      setInitialValues(values);
      form.setFieldsValue(values);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError("Lỗi tải dữ liệu", message);
      navigate(ROUTES.NHA_LUOI);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload: NhaLuoiDto = {
        ten_nha_luoi: values.ten_nha_luoi,
        khu: values.khu,
        so_be: values.so_be,
        dien_tich: Number(values.dien_tich),
        dia_diem: values.dia_diem,
      };

      await nhaLuoiApi.update(Number(id), payload);
      notifySuccess(SUCCESS_MESSAGES.UPDATE);
      navigate(ROUTES.NHA_LUOI);
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
        <HeaderPageForm title="Sửa nhà lưới" backUrl={ROUTES.NHA_LUOI} />

        {/* Form chính */}
        <FormNhaLuoi form={form} initialValues={initialValues} />

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
          <DanhSachLanSuDung nhaLuoiId={Number(id)} />
        </div>
      </div>
    </div>
  );
}

export default SuaNhaLuoi;
