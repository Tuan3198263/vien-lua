/**
 * Modal Thêm Kinh Phí Năm
 */

import { Modal, Form } from "antd";
import FormKinhPhiNam from "./FormKinhPhiNam";
import { notifyError } from "@/utils/notification";

interface ThemKinhPhiNamProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

function ThemKinhPhiNam({
  open,
  onCancel,
  onSubmit,
  loading = false,
}: ThemKinhPhiNamProps) {
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
      title="Thêm kinh phí năm"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Thêm"
      cancelText="Hủy"
    >
      <FormKinhPhiNam form={form} />
    </Modal>
  );
}

export default ThemKinhPhiNam;
