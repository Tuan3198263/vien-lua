/**
 * Form Kinh Phí Năm - UI Component
 */

import { useEffect } from "react";
import { Form, InputNumber, Row, Col } from "antd";
import { KINH_PHI_NAM_VALIDATOR } from "@/validators/deTai.validator";

export interface FormKinhPhiNamValues {
  nam: number;
  kinh_phi: number;
}

interface FormKinhPhiNamProps {
  form: any;
  initialValues?: any;
}

/**
 * Component Form Kinh Phí Năm
 */
function FormKinhPhiNam({ form, initialValues }: FormKinhPhiNamProps) {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" autoComplete="off">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Năm" name="nam" rules={KINH_PHI_NAM_VALIDATOR.nam}>
            <InputNumber
              placeholder="VD: 2024"
              style={{ width: "100%" }}
              min={1900}
              max={2100}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Kinh phí (VNĐ)"
            name="kinh_phi"
            rules={KINH_PHI_NAM_VALIDATOR.kinh_phi}
          >
            <InputNumber
              placeholder="Nhập kinh phí"
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default FormKinhPhiNam;
