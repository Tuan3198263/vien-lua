/**
 * Form Hợp Đồng - UI Component thuần túy
 * Chịu trách nhiệm hiển thị và validation
 */

import { useEffect, useState } from "react";
import { Form, Input, Row, Col } from "antd";
import { HOP_DONG_RULES } from "@/validators/hopDong.validator";
import { FileUpload } from "@/components/FileUpload";

const { TextArea } = Input;

export interface FormHopDongValues {
  so_hop_dong: string;
  doi_tac: string;
  ghi_chu?: string;
}

interface FormHopDongProps {
  form: any;
  mode: "create" | "edit";
  initialValues?: any;
  onFileChange?: (file: File | null) => void;
  onDeleteCurrentFile?: () => void;
}

/**
 * Component Form Hợp Đồng (UI thuần túy)
 */
function FormHopDong({
  form,
  mode: _mode,
  initialValues,
  onFileChange,
  onDeleteCurrentFile,
}: FormHopDongProps) {
  const [currentFile, setCurrentFile] = useState<any>(null);

  /**
   * Set giá trị ban đầu cho form
   */
  useEffect(() => {
    // Reset file trước khi set lại
    setCurrentFile(null);

    if (initialValues) {
      form.setFieldsValue({
        so_hop_dong: initialValues.so_hop_dong,
        doi_tac: initialValues.doi_tac,
        ghi_chu: initialValues.ghi_chu,
      });

      // Set file hiện tại nếu có
      if (initialValues.file_hop_dong) {
        setCurrentFile(initialValues.file_hop_dong);
      }
    } else {
      // Nếu không có initialValues, reset form
      form.resetFields();
    }
  }, [initialValues, form]);

  /**
   * Xử lý khi file thay đổi
   */
  const handleFileChange = (file: File | null) => {
    onFileChange?.(file);
  };

  /**
   * Xử lý xóa file hiện tại
   */
  const handleDeleteCurrent = () => {
    setCurrentFile(null);
    onDeleteCurrentFile?.();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      style={{ marginTop: 8 }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Số hợp đồng"
            name="so_hop_dong"
            rules={HOP_DONG_RULES.so_hop_dong}
          >
            <Input placeholder="Nhập số hợp đồng (VD: HD-2024-001)" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Đối tác"
            name="doi_tac"
            rules={HOP_DONG_RULES.doi_tac}
          >
            <Input placeholder="Nhập tên đối tác" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Ghi chú"
            name="ghi_chu"
            rules={HOP_DONG_RULES.ghi_chu}
          >
            <TextArea
              placeholder="Nhập ghi chú"
              rows={3}
              showCount
              maxLength={255}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* File Upload Component */}
      <Row gutter={16}>
        <Col span={24}>
          <FileUpload
            currentFile={currentFile}
            onChange={handleFileChange}
            onDeleteCurrent={handleDeleteCurrent}
            label="File đính kèm"
          />
        </Col>
      </Row>
    </Form>
  );
}

export default FormHopDong;
