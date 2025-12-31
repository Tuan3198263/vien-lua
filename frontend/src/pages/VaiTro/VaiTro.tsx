/**
 * Trang quản lý vai trò
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import DanhSachVaiTro from "./DanhSachVaiTro";
import ThemVaiTro from "./ThemVaiTro";
import SuaVaiTro from "./SuaVaiTro";
import { VaiTro } from "@/interfaces";
import { notifySuccess, notifyError } from "@/utils/notification";
import { vaiTroApi } from "@/services/api/vaiTroApi";
import { ROUTE_LABELS } from "@/constants/routes";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

const { Title } = Typography;

/**
 * Component trang quản lý vai trò
 */
function VaiTroPage() {
  const [openThemForm, setOpenThemForm] = useState(false);
  const [openSuaForm, setOpenSuaForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VaiTro | undefined>();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Mở form thêm mới
   */
  const handleOpenCreate = () => {
    setOpenThemForm(true);
  };

  /**
   * Mở form sửa - Fetch đầy đủ data từ API
   */
  const handleOpenEdit = async (record: VaiTro) => {
    try {
      setLoading(true);
      const fullData = await vaiTroApi.getById(record.id!);
      setSelectedRecord(fullData);
      setOpenSuaForm(true);
    } catch (error: any) {
      notifyError(ERROR_MESSAGES.FETCH_FAILED, error.message);
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
   * Xử lý thêm vai trò
   */
  const handleThem = async (values: any) => {
    try {
      setLoading(true);
      await vaiTroApi.create(values);
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
   * Xử lý sửa vai trò
   */
  const handleSua = async (values: any) => {
    try {
      if (!selectedRecord?.id) return;

      setLoading(true);
      await vaiTroApi.update(selectedRecord.id, values);
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
   * Xử lý xóa vai trò
   */
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await vaiTroApi.delete(id);
      notifySuccess(SUCCESS_MESSAGES.DELETE);
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError(ERROR_MESSAGES.DELETE_FAILED, message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xuất Excel
   */
  const handleExport = () => {
    notifySuccess("Tính năng xuất Excel đang phát triển");
  };

  return (
    <Card>
      <Flex vertical gap="large">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap="small">
          <Title level={3} style={{ margin: 0, color: "#52c41a" }}>
            {ROUTE_LABELS.VAI_TRO.toUpperCase()}
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
        <DanhSachVaiTro
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          refresh={refreshKey}
        />
      </Flex>

      {/* Form Thêm */}
      <ThemVaiTro
        open={openThemForm}
        onCancel={handleCloseThemForm}
        onSubmit={handleThem}
        loading={loading}
      />

      {/* Form Sửa */}
      <SuaVaiTro
        open={openSuaForm}
        initialValues={selectedRecord}
        onCancel={handleCloseSuaForm}
        onSubmit={handleSua}
        loading={loading}
      />
    </Card>
  );
}

export default VaiTroPage;
