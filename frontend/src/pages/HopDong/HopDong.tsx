/**
 * Trang quản lý hợp đồng
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { PlusOutlined, ExportOutlined } from "@ant-design/icons";
import DanhSachHopDong from "./DanhSachHopDong";
import ThemHopDong from "./ThemHopDong";
import SuaHopDong from "./SuaHopDong";
import { HopDong } from "@/interfaces";
import { notifySuccess, notifyError } from "@/utils/notification";
import { hopDongApi } from "@/services/api/hopDongApi";
import { ROUTE_LABELS } from "@/constants/routes";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

const { Title } = Typography;

/**
 * Component trang quản lý hợp đồng
 */
function HopDongPage() {
  const [openThemForm, setOpenThemForm] = useState(false);
  const [openSuaForm, setOpenSuaForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HopDong | undefined>();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  /**
   * Mở form thêm mới
   */
  const handleOpenCreate = () => {
    setOpenThemForm(true);
  };

  /**
   * Mở form sửa
   */
  const handleOpenEdit = async (record: HopDong) => {
    try {
      setLoading(true);
      // Gọi API getById để lấy đầy đủ thông tin (bao gồm file)
      const detail = await hopDongApi.getById(record.id!);
      setSelectedRecord(detail);
      setOpenSuaForm(true);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError("Lỗi tải thông tin", message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đóng form thêm
   */
  const handleCloseThemForm = () => {
    setOpenThemForm(false);
  };

  /**
   * Đóng form sửa
   */
  const handleCloseSuaForm = () => {
    setOpenSuaForm(false);
    setSelectedRecord(undefined);
  };

  /**
   * Xử lý thêm hợp đồng
   */
  const handleThem = async (values: any, file?: File) => {
    try {
      setLoading(true);
      await hopDongApi.create(values, file);
      notifySuccess(SUCCESS_MESSAGES.CREATE);
      handleCloseThemForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError(ERROR_MESSAGES.CREATE_FAILED, message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý sửa hợp đồng
   */
  const handleSua = async (values: any, file?: File, deleteFile?: boolean) => {
    try {
      if (!selectedRecord?.id) return;

      setLoading(true);
      await hopDongApi.update(selectedRecord.id, values, file, deleteFile);
      notifySuccess(SUCCESS_MESSAGES.UPDATE);
      handleCloseSuaForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError(ERROR_MESSAGES.UPDATE_FAILED, message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý xóa hợp đồng
   */
  const handleXoa = async (id: number) => {
    try {
      await hopDongApi.delete(id);
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
      // Export đúng trang hiện tại (bao gồm page và limit)
      await hopDongApi.export(currentFilters);
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
            {ROUTE_LABELS.HOP_DONG.toUpperCase()}
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
        <DanhSachHopDong
          onEdit={handleOpenEdit}
          onDelete={handleXoa}
          refresh={refreshKey}
          onDataChange={(hasData) => setHasData(hasData)}
          onFilterChange={(filters) => setCurrentFilters(filters)}
        />
      </Flex>

      {/* Modal Thêm */}
      <ThemHopDong
        open={openThemForm}
        onCancel={handleCloseThemForm}
        onSubmit={handleThem}
        loading={loading}
      />

      {/* Modal Sửa */}
      <SuaHopDong
        open={openSuaForm}
        initialValues={selectedRecord}
        onCancel={handleCloseSuaForm}
        onSubmit={handleSua}
        loading={loading}
      />
    </Card>
  );
}

export default HopDongPage;
