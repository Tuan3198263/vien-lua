/**
 * Form Lần Sử Dụng Nhà Lưới - UI Component
 */

import { useEffect, useState } from "react";
import { Form, InputNumber, Row, Col, Select, Input, DatePicker } from "antd";
import { LAN_SU_DUNG_VALIDATOR } from "@/validators/nhaLuoi.validator";
import { FileUpload } from "@/components/FileUpload";
import { taoOptionsTuDanhMuc } from "@/constants/danhMuc";
import { deCuongThiNghiemApi } from "@/services/api/deCuongThiNghiemApi";
import { notifyError } from "@/utils/notification";
import { DeCuongThiNghiem } from "@/interfaces";
import dayjs from "dayjs";

export interface FormLanSuDungValues {
  de_cuong_thi_nghiem_id: number;
  dung_cu?: string;
  so_luong?: number;
  ngay_muon?: string;
  ngay_tra?: string;
  khau_hao?: number;
  hien_trang?: string;
}

interface FormLanSuDungProps {
  form: any;
  initialValues?: any;
  onFileChange?: (file: File | null) => void;
  onDeleteFileChange?: (deleteFile: boolean) => void;
  existingFile?: any;
}

function FormLanSuDung({
  form,
  initialValues,
  onFileChange,
  onDeleteFileChange,
  existingFile,
}: FormLanSuDungProps) {
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [loadingDeCuong, setLoadingDeCuong] = useState(false);
  const [danhSachDeCuong, setDanhSachDeCuong] = useState<DeCuongThiNghiem[]>(
    []
  );
  const [selectedDeCuong, setSelectedDeCuong] =
    useState<DeCuongThiNghiem | null>(null);

  /**
   * Load danh sách đề cương thí nghiệm
   */
  useEffect(() => {
    loadDanhSachDeCuong();
  }, []);

  useEffect(() => {
    setCurrentFile(existingFile || null);

    if (initialValues) {
      // Set giá trị vào form (dung_cu giữ nguyên dạng string)
      form.setFieldsValue({
        de_cuong_thi_nghiem_id: initialValues.de_cuong_thi_nghiem_id,
        dung_cu: initialValues.dung_cu,
        so_luong: initialValues.so_luong,
        ngay_muon: initialValues.ngay_muon
          ? dayjs(initialValues.ngay_muon)
          : null,
        ngay_tra: initialValues.ngay_tra ? dayjs(initialValues.ngay_tra) : null,
        khau_hao: initialValues.khau_hao,
        hien_trang: initialValues.hien_trang,
      });

      // Tìm đề cương để hiển thị thông tin
      if (initialValues.de_cuong_thi_nghiem_id && danhSachDeCuong.length > 0) {
        const deCuong = danhSachDeCuong.find(
          (dc) => dc.id === initialValues.de_cuong_thi_nghiem_id
        );
        if (deCuong) {
          setSelectedDeCuong(deCuong);
        }
      }
    } else {
      form.resetFields();
      setSelectedDeCuong(null);
    }
  }, [initialValues, existingFile, danhSachDeCuong, form]);

  const loadDanhSachDeCuong = async () => {
    try {
      setLoadingDeCuong(true);
      const response = await deCuongThiNghiemApi.getAll({
        page: 1,
        limit: 100,
      });
      setDanhSachDeCuong(response.data);
    } catch (error: any) {
      notifyError("Lỗi tải danh sách đề cương thí nghiệm", error.message);
    } finally {
      setLoadingDeCuong(false);
    }
  };

  /**
   * Xử lý khi chọn đề cương thí nghiệm
   */
  const handleDeCuongChange = (deCuongId: number) => {
    const deCuong = danhSachDeCuong.find((dc) => dc.id === deCuongId);
    setSelectedDeCuong(deCuong || null);
  };

  const handleFileChange = (file: File | null) => {
    onFileChange?.(file);
  };

  const handleDeleteCurrent = () => {
    setCurrentFile(null);
    onDeleteFileChange?.(true);
  };

  return (
    <Form form={form} layout="vertical" autoComplete="off">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Tên thí nghiệm"
            name="de_cuong_thi_nghiem_id"
            rules={LAN_SU_DUNG_VALIDATOR.de_cuong_thi_nghiem_id}
          >
            <Select
              placeholder="Chọn đề cương thí nghiệm"
              showSearch
              loading={loadingDeCuong}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={handleDeCuongChange}
              options={danhSachDeCuong.map((dc) => ({
                label: dc.ten_thi_nghiem,
                value: dc.id!,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Thông tin đề cương (disabled) */}
      {selectedDeCuong && (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Người thực hiện">
                <Input value={selectedDeCuong.nguoi_thuc_hien} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Đề tài">
                <Input
                  value={
                    selectedDeCuong.deTai?.ten_de_tai ||
                    selectedDeCuong.de_tai?.ten_de_tai ||
                    "-"
                  }
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Cấp quản lý đề tài">
                <Input
                  value={
                    selectedDeCuong.deTai?.cap_quan_ly_de_tai ||
                    selectedDeCuong.de_tai?.cap_quan_ly_de_tai ||
                    "-"
                  }
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày bắt đầu - Ngày kết thúc">
                <Input
                  value={`${dayjs(selectedDeCuong.ngay_bat_dau).format(
                    "DD/MM/YYYY"
                  )} - ${dayjs(selectedDeCuong.ngay_ket_thuc).format(
                    "DD/MM/YYYY"
                  )}`}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Dụng cụ"
            name="dung_cu"
            rules={LAN_SU_DUNG_VALIDATOR.dung_cu}
          >
            <Select
              placeholder="Chọn dụng cụ"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={taoOptionsTuDanhMuc("DUNG_CU_NHA_LUOI")}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Số lượng"
            name="so_luong"
            rules={LAN_SU_DUNG_VALIDATOR.so_luong}
          >
            <InputNumber
              placeholder="Nhập số lượng"
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ngày mượn"
            name="ngay_muon"
            rules={LAN_SU_DUNG_VALIDATOR.ngay_muon}
          >
            <DatePicker
              placeholder="Chọn ngày mượn"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                const ngayTra = form.getFieldValue("ngay_tra");
                if (!current || !ngayTra) return false;
                return current.isAfter(ngayTra, "day");
              }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Ngày trả"
            name="ngay_tra"
            rules={LAN_SU_DUNG_VALIDATOR.ngay_tra}
          >
            <DatePicker
              placeholder="Chọn ngày trả"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                const ngayMuon = form.getFieldValue("ngay_muon");
                if (!current || !ngayMuon) return false;
                return current.isBefore(ngayMuon, "day");
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Khấu hao (%)"
            name="khau_hao"
            rules={LAN_SU_DUNG_VALIDATOR.khau_hao}
          >
            <InputNumber
              placeholder="Nhập % khấu hao"
              style={{ width: "100%" }}
              min={0}
              max={100}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Hiện trạng"
            name="hien_trang"
            rules={LAN_SU_DUNG_VALIDATOR.hien_trang}
          >
            <Select
              placeholder="Chọn hiện trạng"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={taoOptionsTuDanhMuc("HIEN_TRANG_DUNG_CU")}
            />
          </Form.Item>
        </Col>
      </Row>

      <FileUpload
        currentFile={currentFile}
        onChange={handleFileChange}
        onDeleteCurrent={handleDeleteCurrent}
        label="File biên bản"
      />
    </Form>
  );
}

export default FormLanSuDung;
