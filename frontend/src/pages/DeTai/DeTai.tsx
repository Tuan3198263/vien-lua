/**
 * Trang quản lý đề tài
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { PlusOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DanhSachDeTai from "./DanhSachDeTai";
import { DeTai } from "@/interfaces";
import {
  notifySuccess,
  notifyError,
  notifyWarning,
} from "@/utils/notification";
import { deTaiApi } from "@/services/api/deTaiApi";
import { ROUTE_LABELS } from "@/constants/routes";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { useDocumentTitle } from "@/hooks";

const { Title } = Typography;

/**
 * Component trang quản lý đề tài
 */
function DeTaiPage() {
  useDocumentTitle();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  /**
   * Mở form thêm mới
   */
  const handleOpenCreate = () => {
    navigate("/de-tai/them");
  };

  /**
   * Mở form sửa
   */
  const handleOpenEdit = (record: DeTai) => {
    navigate(`/de-tai/sua/${record.id}`);
  };

  /**
   * Xem chi tiết
   */
  const handleView = (record: DeTai) => {
    navigate(`/de-tai/${record.id}`);
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
  const handleExport = async () => {
    if (!hasData) {
      notifyWarning("Chưa có dữ liệu để xuất");
      return;
    }

    try {
      setExportLoading(true);
      await deTaiApi.export(currentFilters);
      notifySuccess("Xuất file thành công");
    } catch (error: any) {
      notifyError("Xuất file thất bại", error.message);
    } finally {
      setExportLoading(false);
    }
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
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
              loading={exportLoading}
              disabled={!hasData}
            >
              Xuất Excel
            </Button>
          </Flex>
        </Flex>

        {/* Danh sách */}
        <DanhSachDeTai
          onView={handleView}
          onEdit={handleOpenEdit}
          onDelete={handleXoa}
          refresh={refreshKey}
          onDataChange={(hasData) => setHasData(hasData)}
          onFilterChange={(filters) => setCurrentFilters(filters)}
        />
      </Flex>
    </Card>
  );
}

export default DeTaiPage;
