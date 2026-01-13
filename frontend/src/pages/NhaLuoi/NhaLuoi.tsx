/**
 * Trang quản lý Nhà Lưới
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import DanhSachNhaLuoi from "./DanhSachNhaLuoi";
import { NhaLuoi } from "@/interfaces";
import { notifySuccess, notifyError } from "@/utils/notification";
import { nhaLuoiApi } from "@/services/api/nhaLuoiApi";
import { ROUTE_LABELS } from "@/constants/routes";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { useDocumentTitle } from "@/hooks";

const { Title } = Typography;

/**
 * Component trang quản lý nhà lưới
 */
function NhaLuoiPage() {
  useDocumentTitle();
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Mở form thêm mới
   */
  const handleOpenCreate = () => {
    notifySuccess("Tính năng đang phát triển");
    console.log("Mở form thêm nhà lưới");
  };

  /**
   * Mở form sửa
   */
  const handleOpenEdit = (record: NhaLuoi) => {
    notifySuccess("Tính năng đang phát triển");
    console.log("Mở form sửa nhà lưới:", record);
  };

  /**
   * Xử lý xóa nhà lưới
   */
  const handleXoa = async (id: number) => {
    try {
      await nhaLuoiApi.delete(id);
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
    notifySuccess("Tính năng đang phát triển");
    console.log("Export to Excel");
  };

  return (
    <Card>
      <Flex vertical gap="large">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap="small">
          <Title level={3} style={{ margin: 0, color: "#52c41a" }}>
            {ROUTE_LABELS.NHA_LUOI.toUpperCase()}
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
        <DanhSachNhaLuoi
          onEdit={handleOpenEdit}
          onDelete={handleXoa}
          refresh={refreshKey}
        />
      </Flex>
    </Card>
  );
}

export default NhaLuoiPage;
