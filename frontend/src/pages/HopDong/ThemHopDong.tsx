/**
 * Modal Thêm Hợp Đồng
 * Container component - Gọi Form và xử lý API
 */

import { useState } from "react";
import { Modal, Form } from "antd";
import FormHopDong from "./FormHopDong";
import { notifyError } from "@/utils/notification";

interface ThemHopDongProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any, file?: File) => void;
  loading?: boolean;
}

/**
 * Component Modal Thêm Hợp Đồng
 */
function ThemHopDong({
  open,
  onCancel,
  onSubmit,
  loading = false,
}: ThemHopDongProps) {
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  /**
   * Xử lý khi file thay đổi
   */
  const handleFileChange = (file: File | null) => {
    setUploadFile(file);
  };

  /**
   * Xử lý khi đóng modal
   */
  const handleCancel = () => {
    form.resetFields();
    setUploadFile(null);
    onCancel();
  };

  /**
   * Xử lý khi submit form
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Gọi onSubmit với values và file
      onSubmit(values, uploadFile || undefined);

      // Reset form
      form.resetFields();
      setUploadFile(null);
    } catch (error: any) {
      console.log("Validation failed:", error);
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      }
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: 18 }}>Thêm hợp đồng</span>}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
      okText="Thêm"
      cancelText="Hủy"
      style={{ top: 40 }}
    >
      <FormHopDong form={form} mode="create" onFileChange={handleFileChange} />
    </Modal>
  );
}

export default ThemHopDong;
