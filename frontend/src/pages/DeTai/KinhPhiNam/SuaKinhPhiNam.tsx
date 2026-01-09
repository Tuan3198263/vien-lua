/**
 * Modal Sửa Kinh Phí Năm
 */

import { Modal, Form } from "antd";
import FormKinhPhiNam from "./FormKinhPhiNam";
import { notifyError } from "@/utils/notification";

interface SuaKinhPhiNamProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  initialValues?: any;
}

function SuaKinhPhiNam({
  open,
  onCancel,
  onSubmit,
  loading = false,
  initialValues,
}: SuaKinhPhiNamProps) {
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
      title="Sửa kinh phí năm"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Lưu"
      cancelText="Hủy"
    >
      <FormKinhPhiNam form={form} initialValues={initialValues} />
    </Modal>
  );
}

export default SuaKinhPhiNam;
