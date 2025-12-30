/**
 * Trang quản lý người dùng
 */

import { useState } from "react";
import { Card, Typography, Button, Flex } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import DanhSachNguoiDung from "./DanhSachNguoiDung";
import ThemNguoiDung from "./ThemNguoiDung";
import SuaNguoiDung from "./SuaNguoiDung";
import { NguoiDung } from "@/interfaces";
import { notifySuccess, notifyError } from "@/utils/notification";
import { nguoiDungApi } from "@/services/api/nguoiDungApi";
import { ROUTE_LABELS } from "@/constants/routes";

const { Title } = Typography;

/**
 * Component trang quản lý người dùng
 */
function NguoiDungPage() {
  const [openThemForm, setOpenThemForm] = useState(false);
  const [openSuaForm, setOpenSuaForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<NguoiDung | undefined>();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Mở form thêm mới
   */
  const handleOpenCreate = () => {
    setOpenThemForm(true);
  };

  /**
   * Mở form sửa
   */
  const handleOpenEdit = (record: NguoiDung) => {
    setSelectedRecord(record);
    setOpenSuaForm(true);
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
   * Xử lý thêm người dùng
   */
  const handleThem = async (values: any) => {
    try {
      setLoading(true);
      await nguoiDungApi.create(values);
      notifySuccess("Thêm người dùng thành công");
      handleCloseThemForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError("Thêm người dùng thất bại", message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý sửa người dùng
   */
  const handleSua = async (values: any) => {
    try {
      if (!selectedRecord?.id) return;

      setLoading(true);

      // Loại bỏ tai_khoan khỏi values vì không được phép update
      const { tai_khoan, ...updateData } = values;

      await nguoiDungApi.update(selectedRecord.id, updateData);
      notifySuccess("Cập nhật người dùng thành công");
      handleCloseSuaForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError("Cập nhật người dùng thất bại", message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý xóa
   */
  const handleDelete = async (id: number) => {
    try {
      await nguoiDungApi.delete(id);
      notifySuccess("Xóa người dùng thành công");
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      notifyError("Xóa người dùng thất bại", message);
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
            {ROUTE_LABELS.NGUOI_DUNG.toUpperCase()}
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
        <DanhSachNguoiDung
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          refresh={refreshKey}
        />
      </Flex>

      {/* Form Thêm */}
      <ThemNguoiDung
        open={openThemForm}
        onCancel={handleCloseThemForm}
        onSubmit={handleThem}
        loading={loading}
      />

      {/* Form Sửa */}
      <SuaNguoiDung
        open={openSuaForm}
        initialValues={selectedRecord}
        onCancel={handleCloseSuaForm}
        onSubmit={handleSua}
        loading={loading}
      />
    </Card>
  );
}

export default NguoiDungPage;
