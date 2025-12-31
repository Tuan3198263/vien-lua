/**
 * Modal Sửa Người Dùng
 * Container component - Gọi Form và xử lý API
 */

import { useState, useEffect } from "react";
import { Modal, Form } from "antd";
import FormNguoiDung from "./FormNguoiDung";
import { NguoiDung, VaiTro } from "@/interfaces";
import { vaiTroApi } from "@/services/api/vaiTroApi";
import { notifyError } from "@/utils/notification";
import dayjs from "dayjs";

interface SuaNguoiDungProps {
  open: boolean;
  initialValues?: NguoiDung;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

/**
 * Component Modal Sửa Người Dùng
 */
function SuaNguoiDung({
  open,
  initialValues,
  onCancel,
  onSubmit,
  loading = false,
}: SuaNguoiDungProps) {
  const [form] = Form.useForm();
  const [vaiTros, setVaiTros] = useState<VaiTro[]>([]);
  const [loadingVaiTros, setLoadingVaiTros] = useState(false);

  /**
   * Load danh sách vai trò
   */
  useEffect(() => {
    if (open) {
      loadVaiTros();
    }
  }, [open]);

  const loadVaiTros = async () => {
    try {
      setLoadingVaiTros(true);
      const response = await vaiTroApi.getAll({ page: 1, limit: 100 });
      setVaiTros(response.data);
    } catch (error: any) {
      notifyError("Lỗi tải vai trò", error.message);
    } finally {
      setLoadingVaiTros(false);
    }
  };

  /**
   * Xử lý khi đóng modal
   */
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  /**
   * Xử lý khi submit form
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Format ngày sinh nếu có
      if (values.ngay_sinh) {
        values.ngay_sinh = dayjs(values.ngay_sinh).format("YYYY-MM-DD");
      }

      onSubmit(values);
      form.resetFields();
    } catch (error: any) {
      console.log("Validation failed:", error);
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      }
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: 18 }}>Sửa người dùng</span>}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
      okText="Cập nhật"
      cancelText="Hủy"
      style={{ top: 40 }}
    >
      <FormNguoiDung
        form={form}
        mode="edit"
        initialValues={
          initialValues
            ? {
                ...initialValues,
                vai_tro_id:
                  initialValues.vai_tro?.id || initialValues.vai_tro_id,
              }
            : undefined
        }
        vaiTros={vaiTros}
        loadingVaiTros={loadingVaiTros}
      />
    </Modal>
  );
}

export default SuaNguoiDung;
