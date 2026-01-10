/**
 * Form Danh Sách Đấu Thầu - UI Component
 */

import { useEffect, useState } from "react";
import { Form, InputNumber, Input, Row, Col } from "antd";
import { DANH_SACH_DAU_THAU_VALIDATOR } from "@/validators/dauThau.validator";
import { FileUpload } from "@/components/FileUpload";

export interface FormDanhSachDauThauValues {
  nam: number;
  kinh_phi: number;
  hinh_thuc?: string;
  buoc?: string;
  trang_thai?: string;
}

interface FormDanhSachDauThauProps {
  form: any;
  initialValues?: any;
  onFileChange?: (file: File | null) => void;
  onDeleteFileChange?: (deleteFile: boolean) => void;
  existingFile?: any;
}

function FormDanhSachDauThau({
  form,
  initialValues,
  onFileChange,
  onDeleteFileChange,
  existingFile,
}: FormDanhSachDauThauProps) {
  const [currentFile, setCurrentFile] = useState<any>(null);

  useEffect(() => {
    setCurrentFile(existingFile || null);

    if (initialValues) {
      form.setFieldsValue({
        nam: initialValues.nam,
        kinh_phi: initialValues.kinh_phi,
        hinh_thuc: initialValues.hinh_thuc,
        buoc: initialValues.buoc,
        trang_thai: initialValues.trang_thai,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, existingFile, form]);

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
        <Col span={12}>
          <Form.Item
            label="Năm"
            name="nam"
            rules={DANH_SACH_DAU_THAU_VALIDATOR.nam}
          >
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
            label="Kinh phí"
            name="kinh_phi"
            rules={DANH_SACH_DAU_THAU_VALIDATOR.kinh_phi}
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

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Hình thức"
            name="hinh_thuc"
            rules={DANH_SACH_DAU_THAU_VALIDATOR.hinh_thuc}
          >
            <Input placeholder="Nhập hình thức đấu thầu" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Bước"
            name="buoc"
            rules={DANH_SACH_DAU_THAU_VALIDATOR.buoc}
          >
            <Input placeholder="Nhập bước đấu thầu" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Trạng thái"
        name="trang_thai"
        rules={DANH_SACH_DAU_THAU_VALIDATOR.trang_thai}
      >
        <Input placeholder="Nhập trạng thái" />
      </Form.Item>

      <FileUpload
        currentFile={currentFile}
        onChange={handleFileChange}
        onDeleteCurrent={handleDeleteCurrent}
        label="File đấu thầu"
      />
    </Form>
  );
}

export default FormDanhSachDauThau;
