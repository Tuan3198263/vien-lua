/**
 * Trang quản lý đề tài
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import DanhSachDeTai from "./DanhSachDeTai";
import { DeTai } from "@/interfaces";
import { notifySuccess, notifyError } from "@/utils/notification";
import { deTaiApi } from "@/services/api/deTaiApi";
import { ROUTE_LABELS } from "@/constants/routes";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

const { Title } = Typography;

/**
 * Component trang quản lý đề tài
 */
function DeTaiPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Mở form thêm mới
   */
  const handleOpenCreate = () => {
    notifySuccess("Chức năng đang được phát triển");
    // TODO: Implement modal thêm mới
  };

  /**
   * Mở form sửa
   */
  const handleOpenEdit = async (record: DeTai) => {
    try {
      // Gọi API getById để lấy đầy đủ thông tin
      const detail = await deTaiApi.getById(record.id!);
      console.log("Chi tiết đề tài:", detail);
      notifySuccess("Chức năng đang được phát triển");
      // TODO: Implement modal sửa
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError("Lỗi tải thông tin", message);
    }
  };

  /**
   * Xử lý xóa đề tài
   */
  const handleXoa = async (id: number) => {
    try {
      await deTaiApi.delete(id);
      notifySuccess(SUCCESS_MESSAGES.DELETE);
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError(ERROR_MESSAGES.DELETE_FAILED, message);
    }
  };

  /**
   * Xử lý export Excel
   */
  const handleExport = () => {
    notifySuccess("Xuất Excel thành công");
    console.log("Export to Excel");
  };

  return (
    <Card>
      <Flex vertical gap="large">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap="small">
          <Title level={3} style={{ margin: 0, color: "#52c41a" }}>
            {ROUTE_LABELS.DE_TAI.toUpperCase()}
          </Title>

          <Flex gap="small" wrap="wrap">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
            >
              Thêm
            </Button>
            <Button icon={<FileExcelOutlined />} onClick={handleExport}>
              Xuất Excel
            </Button>
          </Flex>
        </Flex>

        {/* Danh sách */}
        <DanhSachDeTai
          onEdit={handleOpenEdit}
          onDelete={handleXoa}
          refresh={refreshKey}
        />
      </Flex>
    </Card>
  );
}

export default DeTaiPage;
