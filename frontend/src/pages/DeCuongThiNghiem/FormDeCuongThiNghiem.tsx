/**
 * Form Đề Cương Thí Nghiệm - UI Component
 */

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  DatePicker,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { DE_CUONG_THI_NGHIEM_VALIDATOR } from "@/validators/deCuongThiNghiem.validator";
import { FileUpload } from "@/components/FileUpload";
import { taoOptionsTuDanhMuc } from "@/constants/danhMuc";
import { deTaiApi } from "@/services/api/deTaiApi";
import { notifyError } from "@/utils/notification";
import { DeTai } from "@/interfaces";

export interface FormDeCuongThiNghiemValues {
  de_tai_id: number;
  ten_thi_nghiem: string;
  loai_hinh_thi_nghiem: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  nguoi_thuc_hien?: string;
  mua_vu?: string;
  kinh_phi_ky_thuat: number;
  kinh_phi_lao_dong: number;
  kinh_phi_nguyen_vat_lieu: number;
}

interface FormDeCuongThiNghiemProps {
  form: any;
  initialValues?: any;
  onFileChange?: (file: File | null) => void;
  onDeleteFileChange?: (deleteFile: boolean) => void;
  existingFile?: any;
  loading?: boolean;
}

function FormDeCuongThiNghiem({
  form,
  initialValues,
  onFileChange,
  onDeleteFileChange,
  existingFile,
  loading = false,
}: FormDeCuongThiNghiemProps) {
  const [currentFile, setCurrentFile] = useState<any>(null);
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
    }
  }, [initialValues, danhSachDeTai]);

  const loadDanhSachDeTai = async () => {
    try {
      setLoadingDeTai(true);
      const response = await deTaiApi.getAll({ page: 1, limit: 100 });
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

  useEffect(() => {
    setCurrentFile(existingFile || null);

    if (initialValues && danhSachDeTai.length > 0) {
      form.setFieldsValue({
        de_tai_id: initialValues.de_tai_id,
        ten_thi_nghiem: initialValues.ten_thi_nghiem,
        loai_hinh_thi_nghiem: initialValues.loai_hinh_thi_nghiem,
        ngay_bat_dau: initialValues.ngay_bat_dau
          ? dayjs(initialValues.ngay_bat_dau)
          : undefined,
        ngay_ket_thuc: initialValues.ngay_ket_thuc
          ? dayjs(initialValues.ngay_ket_thuc)
          : undefined,
        nguoi_thuc_hien: initialValues.nguoi_thuc_hien,
        mua_vu: initialValues.mua_vu,
        kinh_phi_ky_thuat: initialValues.kinh_phi_ky_thuat,
        kinh_phi_lao_dong: initialValues.kinh_phi_lao_dong,
        kinh_phi_nguyen_vat_lieu: initialValues.kinh_phi_nguyen_vat_lieu,
      });
    }
  }, [initialValues, existingFile, form, danhSachDeTai]);

  const handleFileChange = (file: File | null) => {
    onFileChange?.(file);
  };

  const handleDeleteCurrent = () => {
    setCurrentFile(null);
    onDeleteFileChange?.(true);
  };

  return (
    <Spin spinning={loading || loadingDeTai}>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        style={{ padding: "24px" }}
      >
        {/* Chọn đề tài */}
        <Form.Item
          label="Tên đề tài"
          name="de_tai_id"
          rules={DE_CUONG_THI_NGHIEM_VALIDATOR.de_tai_id}
        >
          <Select
            placeholder="Chọn đề tài"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleDeTaiChange}
            options={danhSachDeTai.map((dt) => ({
              label: dt.ten_de_tai,
              value: dt.id,
            }))}
          />
        </Form.Item>

        {/* Hiển thị thông tin đề tài */}
        {selectedDeTai && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <div style={{ marginBottom: 8 }}>
                <strong>Cấp đề tài:</strong> {selectedDeTai.cap_quan_ly_de_tai}
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 8 }}>
                <strong>Đơn vị phê duyệt:</strong>{" "}
                {selectedDeTai.don_vi_phe_duyet}
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 8 }}>
                <strong>Chủ nhiệm:</strong> {selectedDeTai.chu_nhiem_de_tai}
              </div>
            </Col>
          </Row>
        )}

        {/* Row 3: Tên thí nghiệm, Loại hình thí nghiệm */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên thí nghiệm"
              name="ten_thi_nghiem"
              rules={DE_CUONG_THI_NGHIEM_VALIDATOR.ten_thi_nghiem}
            >
              <Input placeholder="Nhập tên thí nghiệm" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Loại hình thí nghiệm"
              name="loai_hinh_thi_nghiem"
              rules={DE_CUONG_THI_NGHIEM_VALIDATOR.loai_hinh_thi_nghiem}
            >
              <Select
                placeholder="Chọn loại hình thí nghiệm"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={taoOptionsTuDanhMuc("LOAI_HINH_THI_NGHIEM")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: Ngày bắt đầu, Ngày kết thúc, Mùa vụ */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Ngày bắt đầu"
              name="ngay_bat_dau"
              rules={DE_CUONG_THI_NGHIEM_VALIDATOR.ngay_bat_dau}
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

          <Col span={8}>
            <Form.Item
              label="Ngày kết thúc"
              name="ngay_ket_thuc"
              rules={DE_CUONG_THI_NGHIEM_VALIDATOR.ngay_ket_thuc}
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

          <Col span={8}>
            <Form.Item
              label="Mùa vụ"
              name="mua_vu"
              rules={DE_CUONG_THI_NGHIEM_VALIDATOR.mua_vu}
            >
              <Select
                placeholder="Chọn mùa vụ"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={taoOptionsTuDanhMuc("MUA_VU")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Người thực hiện */}
        <Form.Item
          label="Người thực hiện"
          name="nguoi_thuc_hien"
          rules={DE_CUONG_THI_NGHIEM_VALIDATOR.nguoi_thuc_hien}
        >
          <Input placeholder="VD: TS. Nguyễn Văn A, ThS. Trần Thị B" />
        </Form.Item>

        {/* Row 6: Kinh phí kỹ thuật, Kinh phí lao động, Kinh phí nguyên vật liệu */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Kinh phí kỹ thuật"
              name="kinh_phi_ky_thuat"
              rules={DE_CUONG_THI_NGHIEM_VALIDATOR.kinh_phi_ky_thuat}
            >
              <InputNumber
                placeholder="Nhập kinh phí"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                addonAfter="VNĐ"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Kinh phí lao động"
              name="kinh_phi_lao_dong"
              rules={DE_CUONG_THI_NGHIEM_VALIDATOR.kinh_phi_lao_dong}
            >
              <InputNumber
                placeholder="Nhập kinh phí"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                addonAfter="VNĐ"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Kinh phí nguyên vật liệu"
              name="kinh_phi_nguyen_vat_lieu"
              rules={DE_CUONG_THI_NGHIEM_VALIDATOR.kinh_phi_nguyen_vat_lieu}
            >
              <InputNumber
                placeholder="Nhập kinh phí"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                addonAfter="VNĐ"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 7: File upload */}
        <FileUpload
          currentFile={currentFile}
          onChange={handleFileChange}
          onDeleteCurrent={handleDeleteCurrent}
          label="File đề cương thí nghiệm"
        />
      </Form>
    </Spin>
  );
}

export default FormDeCuongThiNghiem;
