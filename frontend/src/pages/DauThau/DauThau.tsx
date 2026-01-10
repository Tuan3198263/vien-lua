/**
 * Trang quản lý đấu thầu
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DanhSachDauThau from "./DanhSachDauThau";
import { DauThau } from "@/interfaces";
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
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Mở form thêm mới
   */
  const handleOpenCreate = () => {
    navigate("/dau-thau/them");
  };

  /**
   * Mở form sửa
   */
  const handleOpenEdit = (record: DauThau) => {
    navigate(`/dau-thau/sua/${record.id}`);
  };

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
        <DanhSachDauThau
          onEdit={handleOpenEdit}
          onDelete={handleXoa}
          refresh={refreshKey}
        />
      </Flex>
    </Card>
  );
}

export default DauThauPage;
