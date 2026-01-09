/**
 * Form Sản Phẩm Dự Kiến - UI Component
 */

import { useEffect } from "react";
import { Form, Input } from "antd";
import { SAN_PHAM_VALIDATOR } from "@/validators/deTai.validator";

export interface FormSanPhamValues {
  ten_san_pham: string;
}

interface FormSanPhamProps {
  form: any;
  initialValues?: any;
}

function FormSanPham({ form, initialValues }: FormSanPhamProps) {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" autoComplete="off">
      <Form.Item
        label="Tên sản phẩm"
        name="ten_san_pham"
        rules={SAN_PHAM_VALIDATOR.ten_san_pham}
      >
        <Input placeholder="Nhập tên sản phẩm dự kiến" />
      </Form.Item>
    </Form>
  );
}

export default FormSanPham;
