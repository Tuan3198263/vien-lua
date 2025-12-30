/**
 * Form Người Dùng - UI Component thuần túy
 * Chịu trách nhiệm hiển thị và validation
 */

import { useEffect } from "react";
import { Form, Input, Select, DatePicker, Row, Col } from "antd";
import { VaiTro, GioiTinh } from "@/interfaces";
import { NGUOI_DUNG_RULES } from "@/validators/nguoiDung.validator";
import dayjs from "dayjs";

const { TextArea } = Input;

export interface FormNguoiDungValues {
  tai_khoan: string;
  mat_khau?: string;
  ho_ten: string;
  email: string;
  sdt?: string;
  ngay_sinh?: string;
  gioi_tinh?: GioiTinh;
  vai_tro_id: number;
  dia_chi?: string;
  ghi_chu?: string;
}

interface FormNguoiDungProps {
  form: any;
  mode: "create" | "edit";
  initialValues?: Partial<FormNguoiDungValues>;
  vaiTros: VaiTro[];
  loadingVaiTros?: boolean;
}

/**
 * Component Form Người Dùng (UI thuần túy)
 */
function FormNguoiDung({
  form,
  mode,
  initialValues,
  vaiTros,
  loadingVaiTros = false,
}: FormNguoiDungProps) {
  /**
   * Set giá trị ban đầu cho form
   */
  useEffect(() => {
    if (initialValues) {
      const formValues = {
        ...initialValues,
        ngay_sinh: initialValues.ngay_sinh
          ? dayjs(initialValues.ngay_sinh)
          : undefined,
      };
      form.setFieldsValue(formValues);
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      style={{ marginTop: 8 }}
    >
      <Row gutter={16}>
        <Col span={mode === "create" ? 12 : 24}>
          <Form.Item
            label="Tài khoản"
            name="tai_khoan"
            rules={NGUOI_DUNG_RULES.tai_khoan}
          >
            <Input placeholder="Nhập tài khoản" disabled={mode === "edit"} />
          </Form.Item>
        </Col>

        {mode === "create" && (
          <Col span={12}>
            <Form.Item
              label="Mật khẩu"
              name="mat_khau"
              rules={NGUOI_DUNG_RULES.mat_khau}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Họ tên"
            name="ho_ten"
            rules={NGUOI_DUNG_RULES.ho_ten}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Email" name="email" rules={NGUOI_DUNG_RULES.email}>
            <Input placeholder="Nhập email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Số điện thoại"
            name="sdt"
            rules={NGUOI_DUNG_RULES.sdt}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Ngày sinh" name="ngay_sinh">
            <DatePicker
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Giới tính" name="gioi_tinh">
            <Select placeholder="Chọn giới tính" showSearch allowClear>
              <Select.Option value={GioiTinh.NAM}>Nam</Select.Option>
              <Select.Option value={GioiTinh.NU}>Nữ</Select.Option>
              <Select.Option value={GioiTinh.KHAC}>Khác</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Vai trò"
            name="vai_tro_id"
            rules={NGUOI_DUNG_RULES.vai_tro_id}
          >
            <Select
              placeholder="Chọn vai trò"
              showSearch
              loading={loadingVaiTros}
              optionFilterProp="children"
            >
              {vaiTros.map((vaiTro) => (
                <Select.Option key={vaiTro.id} value={vaiTro.id}>
                  {vaiTro.ten_vai_tro}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Địa chỉ"
            name="dia_chi"
            rules={NGUOI_DUNG_RULES.dia_chi}
          >
            <TextArea placeholder="Nhập địa chỉ" rows={2} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Ghi chú"
            name="ghi_chu"
            rules={NGUOI_DUNG_RULES.ghi_chu}
          >
            <TextArea placeholder="Nhập ghi chú" rows={2} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default FormNguoiDung;
