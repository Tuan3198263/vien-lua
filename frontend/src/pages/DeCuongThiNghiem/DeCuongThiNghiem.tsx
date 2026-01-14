/**
 * Trang quản lý đề cương thí nghiệm
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { PlusOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DanhSachDeCuongThiNghiem from "./DanhSachDeCuongThiNghiem";
import { DeCuongThiNghiem } from "@/interfaces";
import { notifySuccess, notifyError } from "@/utils/notification";
import { deCuongThiNghiemApi } from "@/services/api/deCuongThiNghiemApi";
import { ROUTE_LABELS } from "@/constants/routes";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import { useDocumentTitle } from "@/hooks";

const { Title } = Typography;

/**
 * Component trang quản lý đề cương thí nghiệm
 */
function DeCuongThiNghiemPage() {
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
    navigate("/de-cuong-thi-nghiem/them");
  };

  /**
   * Mở form sửa
   */
  const handleOpenEdit = (record: DeCuongThiNghiem) => {
    navigate(`/de-cuong-thi-nghiem/sua/${record.id}`);
  };

  /**
   * Xử lý xóa đề cương thí nghiệm
   */
  const handleXoa = async (id: number) => {
    try {
      await deCuongThiNghiemApi.delete(id);
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
      notifyError("", "Chưa có dữ liệu để xuất");
      return;
    }

    try {
      setExportLoading(true);
      await deCuongThiNghiemApi.export(currentFilters);
      notifySuccess("Xuất file thành công");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError("Xuất file thất bại", message);
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
            {ROUTE_LABELS.DE_CUONG_THI_NGHIEM.toUpperCase()}
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
        <DanhSachDeCuongThiNghiem
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

export default DeCuongThiNghiemPage;
