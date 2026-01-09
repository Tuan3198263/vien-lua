/**
 * Modal Sửa Sản Phẩm Dự Kiến
 */

import { Modal, Form } from "antd";
import FormSanPham from "./FormSanPham";
import { notifyError } from "@/utils/notification";

interface SuaSanPhamProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  initialValues?: any;
}

function SuaSanPham({
  open,
  onCancel,
  onSubmit,
  loading = false,
  initialValues,
}: SuaSanPhamProps) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      }
    }
  };

  return (
    <Modal
      title="Sửa sản phẩm dự kiến"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Lưu"
      cancelText="Hủy"
    >
      <FormSanPham form={form} initialValues={initialValues} />
    </Modal>
  );
}

export default SuaSanPham;
