/**
 * Modal Sửa Vai Trò
 */

import { useEffect } from "react";
import { Modal, Form } from "antd";
import FormVaiTro from "./FormVaiTro";
import { VaiTro } from "@/interfaces";
import { notifyError } from "@/utils/notification";

interface SuaVaiTroProps {
  open: boolean;
  initialValues?: VaiTro;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

/**
 * Component Modal Sửa Vai Trò
 */
function SuaVaiTro({
  open,
  initialValues,
  onCancel,
  onSubmit,
  loading = false,
}: SuaVaiTroProps) {
  const [form] = Form.useForm();
  let getPermissionsRef: (() => any[]) | null = null;

  /**
   * Lưu reference của getPermissions function
   */
  const handlePermissionsChange = (getPermissions: () => any[]) => {
    getPermissionsRef = getPermissions;
  };

  /**
   * Reset form khi đóng modal
   */
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

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

      // Lấy permissions
      const permissions = getPermissionsRef ? getPermissionsRef() : [];

      const submitData = {
        ...values,
        permissions,
      };

      onSubmit(submitData);
    } catch (error: any) {
      console.log("Validation failed:", error);
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      }
    }
  };

  // Convert phanQuyen array thành permissions format
  const convertInitialValues = (vaiTro?: VaiTro) => {
    if (!vaiTro) return undefined;

    const permissions =
      vaiTro.phanQuyen?.reduce((acc, pq) => {
        const existing = acc.find((p) => p.ma_module === pq.ma_module);
        if (existing) {
          existing.hanh_dong.push(pq.hanh_dong);
        } else {
          acc.push({
            ma_module: pq.ma_module,
            hanh_dong: [pq.hanh_dong],
          });
        }
        return acc;
      }, [] as any[]) || [];

    return {
      ...vaiTro,
      permissions,
    };
  };

  // Chỉ render modal khi có initialValues
  if (!initialValues) {
    return null;
  }

  return (
    <Modal
      title={<span style={{ fontSize: 18 }}>Sửa vai trò</span>}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={900}
      okText="Cập nhật"
      cancelText="Hủy"
      style={{ top: 40 }}
    >
      <Form form={form}>
        <FormVaiTro
          form={form}
          mode="edit"
          initialValues={convertInitialValues(initialValues)}
          onPermissionsChange={handlePermissionsChange}
        />
      </Form>
    </Modal>
  );
}

export default SuaVaiTro;
