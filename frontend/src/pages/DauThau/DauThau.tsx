/**
 * Trang quản lý đấu thầu
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import DanhSachDauThau from "./DanhSachDauThau";
import { notifySuccess, notifyError } from "@/utils/notification";
import { dauThauApi } from "@/services/api/dauThauApi";
import { ROUTE_LABELS } from "@/constants/routes";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { useDocumentTitle } from "@/hooks";

const { Title } = Typography;

/**
 * Component trang quản lý đấu thầu
 */
function DauThauPage() {
  useDocumentTitle();
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Xử lý xóa đấu thầu
   */
  const handleXoa = async (id: number) => {
    try {
      await dauThauApi.delete(id);
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
            {ROUTE_LABELS.DAU_THAU.toUpperCase()}
          </Title>

          <Flex gap="small" wrap="wrap">
            <Button icon={<FileExcelOutlined />} onClick={handleExport}>
              Xuất Excel
            </Button>
          </Flex>
        </Flex>

        {/* Danh sách */}
        <DanhSachDauThau onDelete={handleXoa} refresh={refreshKey} />
      </Flex>
    </Card>
  );
}

export default DauThauPage;
