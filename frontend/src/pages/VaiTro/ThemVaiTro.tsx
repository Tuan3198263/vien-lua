/**
 * Modal Thêm Vai Trò
 */

import { useState } from "react";
import { Modal, Form } from "antd";
import FormVaiTro from "./FormVaiTro";
import { notifyError } from "@/utils/notification";

interface ThemVaiTroProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

/**
 * Component Modal Thêm Vai Trò
 */
function ThemVaiTro({
  open,
  onCancel,
  onSubmit,
  loading = false,
}: ThemVaiTroProps) {
  const [form] = Form.useForm();
  const [formKey, setFormKey] = useState(0); // Key để force re-render FormVaiTro
  let getPermissionsRef: (() => any[]) | null = null;

  /**
   * Lưu reference của getPermissions function
   */
  const handlePermissionsChange = (getPermissions: () => any[]) => {
    getPermissionsRef = getPermissions;
  };

  /**
   * Xử lý cancel
   */
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  /**
   * Xử lý submit form
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const permissions = getPermissionsRef ? getPermissionsRef() : [];

      const submitData = {
        ...values,
        permissions,
      };

      onSubmit(submitData);
      form.resetFields();
      setFormKey((prev) => prev + 1); // Force re-render FormVaiTro để reset state
    } catch (error: any) {
      console.log("Validation failed:", error);
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      }
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: 18 }}>Thêm vai trò</span>}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={900}
      okText="Thêm"
      cancelText="Hủy"
      style={{ top: 40 }}
    >
      <Form form={form}>
        <FormVaiTro
          key={formKey}
          form={form}
          mode="create"
          onPermissionsChange={handlePermissionsChange}
        />
      </Form>
    </Modal>
  );
}

export default ThemVaiTro;
