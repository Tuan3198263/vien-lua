/**
 * Form Hồ Sơ Lưu Trữ - UI Component
 */

import { useEffect, useState } from "react";
import { Form, InputNumber, Row, Col } from "antd";
import { HO_SO_LUU_TRU_VALIDATOR } from "@/validators/deTai.validator";
import { DanhMucSelect } from "@/components/DanhMucSelect";
import { FileUpload } from "@/components/FileUpload";

export interface FormHoSoLuuTruValues {
  loai_ho_so: string;
  nam: number;
}

interface FormHoSoLuuTruProps {
  form: any;
  initialValues?: any;
  onFileChange?: (file: File | null) => void;
  onDeleteCurrentFile?: () => void;
}

function FormHoSoLuuTru({
  form,
  initialValues,
  onFileChange,
  onDeleteCurrentFile,
}: FormHoSoLuuTruProps) {
  const [currentFile, setCurrentFile] = useState<any>(null);

  useEffect(() => {
    setCurrentFile(null);

    if (initialValues) {
      form.setFieldsValue({
        loai_ho_so: initialValues.loai_ho_so,
        nam: initialValues.nam,
      });

      if (initialValues.file_ho_so) {
        setCurrentFile(initialValues.file_ho_so);
      }
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFileChange = (file: File | null) => {
    onFileChange?.(file);
  };

  const handleDeleteCurrent = () => {
    setCurrentFile(null);
    onDeleteCurrentFile?.();
  };

  return (
    <Form form={form} layout="vertical" autoComplete="off">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Loại hồ sơ"
            name="loai_ho_so"
            rules={HO_SO_LUU_TRU_VALIDATOR.loai_ho_so}
          >
            <DanhMucSelect
              maDanhMuc="LOAI_HO_SO"
              placeholder="Chọn loại hồ sơ"
              allowCustom
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Năm" name="nam" rules={HO_SO_LUU_TRU_VALIDATOR.nam}>
            <InputNumber
              placeholder="VD: 2024"
              style={{ width: "100%" }}
              min={1900}
              max={2100}
            />
          </Form.Item>
        </Col>
      </Row>

      <FileUpload
        currentFile={currentFile}
        onChange={handleFileChange}
        onDeleteCurrent={handleDeleteCurrent}
        label="File hồ sơ"
      />
    </Form>
  );
}

export default FormHoSoLuuTru;
