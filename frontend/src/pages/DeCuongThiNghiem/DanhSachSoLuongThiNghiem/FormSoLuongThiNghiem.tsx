/**
 * Form Số Lượng Thí Nghiệm - UI Component
 */

import { useEffect } from "react";
import { Form, Input, InputNumber, Row, Col } from "antd";
import { DANH_SACH_SO_LUONG_THI_NGHIEM_VALIDATOR } from "@/validators/deCuongThiNghiem.validator";

export interface FormSoLuongThiNghiemValues {
  dia_diem: string;
  vi_tri: string;
  dien_tich: number;
}

interface FormSoLuongThiNghiemProps {
  form: any;
  initialValues?: any;
}

function FormSoLuongThiNghiem({
  form,
  initialValues,
}: FormSoLuongThiNghiemProps) {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        dia_diem: initialValues.dia_diem,
        vi_tri: initialValues.vi_tri,
        dien_tich: initialValues.dien_tich,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" autoComplete="off">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Địa điểm"
            name="dia_diem"
            rules={DANH_SACH_SO_LUONG_THI_NGHIEM_VALIDATOR.dia_diem}
          >
            <Input placeholder="VD: Xã Tân An, huyện Châu Thành" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Vị trí"
            name="vi_tri"
            rules={DANH_SACH_SO_LUONG_THI_NGHIEM_VALIDATOR.vi_tri}
          >
            <Input placeholder="Nhập vị trí" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Diện tích (ha)"
        name="dien_tich"
        rules={DANH_SACH_SO_LUONG_THI_NGHIEM_VALIDATOR.dien_tich}
      >
        <InputNumber
          placeholder="Nhập diện tích"
          style={{ width: "100%" }}
          min={0}
          step={0.01}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/(,*)/g, "") as any}
        />
      </Form.Item>
    </Form>
  );
}

export default FormSoLuongThiNghiem;
