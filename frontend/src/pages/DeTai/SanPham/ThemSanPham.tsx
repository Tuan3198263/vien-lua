/**
 * Modal Thêm Sản Phẩm Dự Kiến
 */

import { Modal, Form } from "antd";
import FormSanPham from "./FormSanPham";
import { notifyError } from "@/utils/notification";

interface ThemSanPhamProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

function ThemSanPham({
  open,
  onCancel,
  onSubmit,
  loading = false,
}: ThemSanPhamProps) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      }
    }
  };

  return (
    <Modal
      title="Thêm sản phẩm dự kiến"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Thêm"
      cancelText="Hủy"
    >
      <FormSanPham form={form} />
    </Modal>
  );
}

export default ThemSanPham;
