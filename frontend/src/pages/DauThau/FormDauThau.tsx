/**
 * Form component cho Đấu Thầu
 * Hiển thị đổ dữ liệu từ đề tài được chọn
 */

import { useEffect, useState } from "react";
import { Form, Row, Col, Select, Input, InputNumber, Spin } from "antd";
import { DauThauDto, DeTai } from "@/interfaces";
import { DAU_THAU_VALIDATOR } from "@/validators/dauThau.validator";
import { deTaiApi } from "@/services/api/deTaiApi";
import { notifyError } from "@/utils/notification";
import { taoOptionsTuDanhMuc } from "@/constants/danhMuc";

interface FormDauThauProps {
  form: any;
  initialValues?: Partial<DauThauDto>;
  loading?: boolean;
}

/**
 * Form nhập liệu cho Đấu Thầu
 */
function FormDauThau({
  form,
  initialValues,
  loading = false,
}: FormDauThauProps) {
  const [loadingDeTai, setLoadingDeTai] = useState(false);
  const [danhSachDeTai, setDanhSachDeTai] = useState<DeTai[]>([]);
  const [selectedDeTai, setSelectedDeTai] = useState<DeTai | null>(null);

  /**
   * Load danh sách đề tài khi component mount
   */
  useEffect(() => {
    loadDanhSachDeTai();
  }, []);

  /**
   * Load thông tin đề tài khi có initialValues
   */
  useEffect(() => {
    if (initialValues?.de_tai_id && danhSachDeTai.length > 0) {
      const deTai = danhSachDeTai.find(
        (dt) => dt.id === initialValues.de_tai_id
      );

      if (deTai) {
        setSelectedDeTai(deTai);
      }
      // Set giá trị vào form sau khi có danh sách đề tài
      form.setFieldsValue({
        de_tai_id: initialValues.de_tai_id,
        nam_thuc_hien: initialValues.nam_thuc_hien,
        nguon_kinh_phi: initialValues.nguon_kinh_phi,
        tong_kinh_phi: initialValues.tong_kinh_phi,
      });
    }
  }, [initialValues, danhSachDeTai, form]);

  const loadDanhSachDeTai = async () => {
    try {
      setLoadingDeTai(true);
      const response = await deTaiApi.getAll({ page: 1, limit: 100 }); // Max 100
      setDanhSachDeTai(response.data);
    } catch (error: any) {
      notifyError("Lỗi tải danh sách đề tài", error.message);
    } finally {
      setLoadingDeTai(false);
    }
  };

  /**
   * Xử lý khi chọn đề tài
   */
  const handleDeTaiChange = (deTaiId: number) => {
    const deTai = danhSachDeTai.find((dt) => dt.id === deTaiId);
    setSelectedDeTai(deTai || null);
  };

  return (
    <Spin spinning={loading || loadingDeTai}>
      <Form form={form} layout="vertical" style={{ padding: "24px" }}>
        <Row gutter={16}>
          {/* Cột 1: Tên đề tài */}
          <Col span={24}>
            <Form.Item
              label="Tên đề tài"
              name="de_tai_id"
              rules={DAU_THAU_VALIDATOR.de_tai_id}
            >
              <Select
                placeholder="Chọn đề tài"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={handleDeTaiChange}
                options={danhSachDeTai.map((dt) => ({
                  label: dt.ten_de_tai,
                  value: dt.id!,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Cột 2: Thông tin đề tài (disabled) */}
        {selectedDeTai && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Đơn vị phê duyệt">
                <Input value={selectedDeTai.don_vi_phe_duyet} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Cấp quản lý đề tài">
                <Input value={selectedDeTai.cap_quan_ly_de_tai} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chủ nhiệm đề tài">
                <Input value={selectedDeTai.chu_nhiem_de_tai} disabled />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Cột 3: Thông tin đấu thầu */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Năm thực hiện"
              name="nam_thuc_hien"
              rules={DAU_THAU_VALIDATOR.nam_thuc_hien}
            >
              <InputNumber
                placeholder="Nhập năm thực hiện"
                style={{ width: "100%" }}
                min={1900}
                max={2100}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Nguồn kinh phí"
              name="nguon_kinh_phi"
              rules={DAU_THAU_VALIDATOR.nguon_kinh_phi}
            >
              <Select
                placeholder="Chọn nguồn kinh phí"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={taoOptionsTuDanhMuc("NGUON_KINH_PHI")}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Tổng kinh phí"
              name="tong_kinh_phi"
              rules={DAU_THAU_VALIDATOR.tong_kinh_phi}
            >
              <InputNumber
                placeholder="Nhập tổng kinh phí"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/,/g, "") as any}
                addonAfter="VNĐ"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}

export default FormDauThau;
