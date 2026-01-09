/**
 * Form Sản Phẩm Thực Tế - UI Component
 */

import { useEffect } from "react";
import { Form, Input } from "antd";
import { SAN_PHAM_THUC_TE_VALIDATOR } from "@/validators/deTai.validator";

export interface FormSanPhamThucTeValues {
  ten_san_pham: string;
}

interface FormSanPhamThucTeProps {
  form: any;
  initialValues?: any;
}

function FormSanPhamThucTe({ form, initialValues }: FormSanPhamThucTeProps) {
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
        rules={SAN_PHAM_THUC_TE_VALIDATOR.ten_san_pham}
      >
        <Input placeholder="Nhập tên sản phẩm thực tế" />
      </Form.Item>
    </Form>
  );
}

export default FormSanPhamThucTe;
