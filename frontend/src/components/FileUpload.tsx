/**
 * Custom FileUpload Component
 * Component upload file với Ant Design và validation logic
 */

import React, { useState } from "react";
import { Upload, Button, Space, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { FILE_VALIDATION } from "@/validators/hopDong.validator";

const { Text } = Typography;

interface FileUploadProps {
  /**
   * File hiện tại (nếu có)
   */
  currentFile?: {
    ten_file?: string;
    ten_goc?: string;
    kich_thuoc?: number;
    presigned_url?: string;
    url_xem?: string;
  };

  /**
   * Callback khi file thay đổi
   */
  onChange?: (file: File | null) => void;

  /**
   * Callback khi xóa file hiện tại
   */
  onDeleteCurrent?: () => void;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Label hiển thị
   */
  label?: string;
}

/**
 * Component upload file cho hợp đồng
 * - Chỉ cho chọn 1 file
 * - Validate theo file.utils.ts (định dạng, dung lượng)
 * - Hỗ trợ xem và xóa file hiện tại
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  currentFile,
  onChange,
  onDeleteCurrent,
  disabled = false,
  label = "File đính kèm",
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /**
   * Cập nhật fileList khi currentFile thay đổi
   */
  React.useEffect(() => {
    if (currentFile) {
      // Hiển thị file hiện tại trong fileList
      setFileList([
        {
          uid: "-1",
          name: currentFile.ten_goc || currentFile.ten_file || "File hiện tại",
          status: "done",
          size: currentFile.kich_thuoc,
        } as UploadFile,
      ]);
    } else {
      setFileList([]);
    }
  }, [currentFile]);

  /**
   * Xử lý trước khi upload (validation)
   */
  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    // Validate file
    const validation = FILE_VALIDATION.isValidFile(file);

    if (!validation.valid) {
      message.error(validation.error);
      return Upload.LIST_IGNORE;
    }

    // Cập nhật fileList với file mới
    setFileList([
      {
        uid: file.uid,
        name: file.name,
        status: "done",
        size: file.size,
      } as UploadFile,
    ]);

    // Callback về parent
    onChange?.(file);

    // Không upload tự động (sẽ upload khi submit form)
    return false;
  };

  /**
   * Xử lý khi xóa file
   */
  const handleRemove = () => {
    setFileList([]);

    // Nếu đang xóa file hiện tại (có id)
    if (currentFile) {
      onDeleteCurrent?.();
    } else {
      // Xóa file mới chọn
      onChange?.(null);
    }
  };

  return (
    <div>
      <Text strong>{label}</Text>
      <div style={{ marginTop: "8px" }}>
        {/* Upload file */}
        <Upload
          fileList={fileList}
          beforeUpload={beforeUpload}
          onRemove={handleRemove}
          maxCount={1}
          disabled={disabled}
        >
          <Button
            icon={<UploadOutlined />}
            disabled={disabled}
            style={{ width: "100%" }}
          >
            Chọn file
          </Button>
        </Upload>

        {/* Hướng dẫn */}
        <Text
          type="secondary"
          style={{ fontSize: "12px", display: "block", marginTop: "8px" }}
        >
          Định dạng: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP (Tối đa 10MB)
        </Text>
      </div>
    </div>
  );
};
