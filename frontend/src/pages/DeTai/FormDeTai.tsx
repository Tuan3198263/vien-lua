/**
 * Form Đề Tài - UI Component thuần túy
 * Chịu trách nhiệm hiển thị và validation
 */

import { useEffect } from "react";
import { Form, Input, Row, Col, DatePicker, InputNumber } from "antd";
import { DE_TAI_VALIDATOR } from "@/validators/deTai.validator";
import { DanhMucSelect } from "@/components/DanhMucSelect";
import dayjs from "dayjs";

const { TextArea } = Input;

export interface FormDeTaiValues {
  ten_de_tai: string;
  ma_de_tai?: string;
  don_vi_phe_duyet: string;
  cap_quan_ly_de_tai: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  phuong_thuc_khoang_chi?: string;
  noi_dung_khoang_chi?: string;
  linh_vuc_khoa_hoc?: string;
  nguon_goc_de_tai?: string;
  hop_dong?: string;
  bien_ban_thanh_ly?: string;
  chu_nhiem_de_tai: string;
  thu_ky_de_tai: string;
  kinh_phi_tong: number;
}

interface FormDeTaiProps {
  form: any;
  initialValues?: any;
  disabled?: boolean;
}

/**
 * Component Form Đề Tài (UI thuần túy)
 * Sử dụng cho: Thêm, Sửa, Chi tiết
 */
function FormDeTai({ form, initialValues, disabled = false }: FormDeTaiProps) {
  /**
   * Set giá trị ban đầu cho form
   */
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        // Convert date strings to dayjs cho DatePicker
        ngay_bat_dau: initialValues.ngay_bat_dau
          ? dayjs(initialValues.ngay_bat_dau)
          : null,
        ngay_ket_thuc: initialValues.ngay_ket_thuc
          ? dayjs(initialValues.ngay_ket_thuc)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      disabled={disabled}
      style={{ padding: "24px" }}
    >
      {/* Row 1: Tên đề tài, Mã đề tài */}
      <Row gutter={16}>
        <Col span={16}>
          <Form.Item
            label="Tên đề tài"
            name="ten_de_tai"
            rules={DE_TAI_VALIDATOR.ten_de_tai}
          >
            <Input placeholder="Nhập tên đề tài" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Mã đề tài"
            name="ma_de_tai"
            rules={DE_TAI_VALIDATOR.ma_de_tai}
          >
            <Input placeholder="Mã đề tài (tự động nếu bỏ trống)" />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 2: Đơn vị phê duyệt, Cấp quản lý, Ngày bắt đầu, Ngày kết thúc */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Đơn vị phê duyệt"
            name="don_vi_phe_duyet"
            rules={DE_TAI_VALIDATOR.don_vi_phe_duyet}
          >
            <DanhMucSelect
              maDanhMuc="DON_VI_PHE_DUYET"
              placeholder="Chọn đơn vị phê duyệt"
              allowCustom
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Cấp quản lý đề tài"
            name="cap_quan_ly_de_tai"
            rules={DE_TAI_VALIDATOR.cap_quan_ly_de_tai}
          >
            <DanhMucSelect
              maDanhMuc="CAP_QUAN_LY_DE_TAI"
              placeholder="Chọn cấp quản lý"
            />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item
            label="Ngày bắt đầu"
            name="ngay_bat_dau"
            rules={DE_TAI_VALIDATOR.ngay_bat_dau}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              style={{ width: "100%" }}
              disabledDate={(current) => {
                const ngayKetThuc = form.getFieldValue("ngay_ket_thuc");
                if (!current || !ngayKetThuc) return false;

                // ❌ Không cho chọn ngày bắt đầu sau ngày kết thúc
                return current.isAfter(ngayKetThuc, "day");
              }}
            />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item
            label="Ngày kết thúc"
            name="ngay_ket_thuc"
            rules={DE_TAI_VALIDATOR.ngay_ket_thuc}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              style={{ width: "100%" }}
              disabledDate={(current) => {
                const ngayBatDau = form.getFieldValue("ngay_bat_dau");
                if (!current || !ngayBatDau) return false;

                // ❌ Không cho chọn ngày kết thúc trước ngày bắt đầu
                return current.isBefore(ngayBatDau, "day");
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 3: Phương thức khoáng chi, Nội dung khoáng chi, Lĩnh vực khoa học */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Phương thức khoáng chi"
            name="phuong_thuc_khoang_chi"
            rules={DE_TAI_VALIDATOR.phuong_thuc_khoang_chi}
          >
            <DanhMucSelect
              maDanhMuc="PHUONG_THUC_KHOANG_CHI"
              placeholder="Chọn phương thức"
              allowCustom
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Nội dung khoáng chi" name="noi_dung_khoang_chi">
            <TextArea
              placeholder="Mô tả nội dung khoáng chi"
              autoSize={{ minRows: 1, maxRows: 3 }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Lĩnh vực khoa học"
            name="linh_vuc_khoa_hoc"
            rules={DE_TAI_VALIDATOR.linh_vuc_khoa_hoc}
          >
            <DanhMucSelect
              maDanhMuc="LINH_VUC_KHOA_HOC"
              placeholder="Chọn lĩnh vực"
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 4: Nguồn gốc, Hợp đồng, Biên bản */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Nguồn gốc đề tài"
            name="nguon_goc_de_tai"
            rules={DE_TAI_VALIDATOR.nguon_goc_de_tai}
          >
            <DanhMucSelect
              maDanhMuc="NGUON_GOC_DE_TAI"
              placeholder="Chọn nguồn gốc"
              allowCustom
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Hợp đồng"
            name="hop_dong"
            rules={DE_TAI_VALIDATOR.hop_dong}
          >
            <Input placeholder="Thông tin hợp đồng liên quan" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Biên bản thanh lý"
            name="bien_ban_thanh_ly"
            rules={DE_TAI_VALIDATOR.bien_ban_thanh_ly}
          >
            <Input placeholder="Thông tin biên bản thanh lý" />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 5: Chủ nhiệm, Thư ký, Kinh phí tổng */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Chủ nhiệm đề tài"
            name="chu_nhiem_de_tai"
            rules={DE_TAI_VALIDATOR.chu_nhiem_de_tai}
          >
            <Input placeholder="Họ tên chủ nhiệm" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Thư ký đề tài"
            name="thu_ky_de_tai"
            rules={DE_TAI_VALIDATOR.thu_ky_de_tai}
          >
            <Input placeholder="Họ tên thư ký" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Kinh phí tổng (VNĐ)"
            name="kinh_phi_tong"
            rules={DE_TAI_VALIDATOR.kinh_phi_tong}
          >
            <InputNumber
              placeholder="Nhập kinh phí tổng"
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default FormDeTai;
