/**
 * Form component cho Nhà Lưới
 */

import { Form, Row, Col, Input, InputNumber, Select } from "antd";
import { NHA_LUOI_VALIDATOR } from "@/validators/nhaLuoi.validator";
import { taoOptionsTuDanhMuc } from "@/constants/danhMuc";

interface FormNhaLuoiProps {
  form: any;
  initialValues?: any;
  loading?: boolean;
}

/**
 * Form nhập liệu cho Nhà Lưới
 */
function FormNhaLuoi({ form }: FormNhaLuoiProps) {
  return (
    <Form form={form} layout="vertical" style={{ padding: "24px" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Tên nhà lưới"
            name="ten_nha_luoi"
            rules={NHA_LUOI_VALIDATOR.ten_nha_luoi}
          >
            <Input placeholder="Nhập tên nhà lưới" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Khu" name="khu" rules={NHA_LUOI_VALIDATOR.khu}>
            <Select
              placeholder="Chọn khu"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={taoOptionsTuDanhMuc("KHU_NHA_LUOI")}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Số bể"
            name="so_be"
            rules={NHA_LUOI_VALIDATOR.so_be}
          >
            <InputNumber
              placeholder="Nhập số bể"
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Diện tích (m²)"
            name="dien_tich"
            rules={NHA_LUOI_VALIDATOR.dien_tich}
          >
            <InputNumber
              placeholder="Nhập diện tích"
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/,/g, "") as any}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Địa điểm"
            name="dia_diem"
            rules={NHA_LUOI_VALIDATOR.dia_diem}
          >
            <Input.TextArea
              placeholder="Nhập địa điểm chi tiết"
              maxLength={255}
              showCount
              rows={3}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default FormNhaLuoi;
