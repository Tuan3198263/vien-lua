/**
 * Modal Sửa Hợp Đồng
 * Container component - Gọi Form và xử lý API
 */

import { useState, useEffect } from "react";
import { Modal, Form } from "antd";
import FormHopDong from "./FormHopDong";
import { HopDong } from "@/interfaces";
import { notifyError } from "@/utils/notification";

interface SuaHopDongProps {
  open: boolean;
  initialValues?: HopDong;
  onCancel: () => void;
  onSubmit: (values: any, file?: File, deleteFile?: boolean) => void;
  loading?: boolean;
}

/**
 * Component Modal Sửa Hợp Đồng
 */
function SuaHopDong({
  open,
  initialValues,
  onCancel,
  onSubmit,
  loading = false,
}: SuaHopDongProps) {
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [deleteCurrentFile, setDeleteCurrentFile] = useState(false);
  const [formKey, setFormKey] = useState(0);

  /**
   * Reset state khi modal mở/đóng
   */
  useEffect(() => {
    if (open) {
      // Tăng key để force remount component
      setFormKey((prev) => prev + 1);
    } else {
      // Reset state khi đóng modal
      setUploadFile(null);
      setDeleteCurrentFile(false);
    }
  }, [open, initialValues]);

  /**
   * Xử lý khi file thay đổi
   */
  const handleFileChange = (file: File | null) => {
    setUploadFile(file);
    // Nếu chọn file mới, không xóa file cũ (sẽ ghi đè)
    if (file) {
      setDeleteCurrentFile(false);
    }
  };

  /**
   * Xử lý xóa file hiện tại
   */
  const handleDeleteCurrentFile = () => {
    setDeleteCurrentFile(true);
    setUploadFile(null);
  };

  /**
   * Xử lý khi đóng modal
   */
  const handleCancel = () => {
    form.resetFields();
    setUploadFile(null);
    setDeleteCurrentFile(false);
    onCancel();
  };

  /**
   * Xử lý khi submit form
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Gọi onSubmit với values, file mới (nếu có), và flag xóa file
      onSubmit(values, uploadFile || undefined, deleteCurrentFile);

      // Reset form
      form.resetFields();
      setUploadFile(null);
      setDeleteCurrentFile(false);
    } catch (error: any) {
      console.log("Validation failed:", error);
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      }
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: 18 }}>Sửa hợp đồng</span>}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
      okText="Cập nhật"
      cancelText="Hủy"
      style={{ top: 40 }}
    >
      <FormHopDong
        key={formKey}
        form={form}
        mode="edit"
        initialValues={initialValues}
        onFileChange={handleFileChange}
        onDeleteCurrentFile={handleDeleteCurrentFile}
      />
    </Modal>
  );
}

export default SuaHopDong;
