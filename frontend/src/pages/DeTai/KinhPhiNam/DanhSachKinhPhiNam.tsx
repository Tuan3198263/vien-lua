/**
 * Danh Sách Kinh Phí Năm - Sub-module Component
 * Hiển thị danh sách kinh phí theo năm của đề tài
 */

import { useState } from "react";
import {
  Table,
  Button,
  Flex,
  Typography,
  Popconfirm,
  Space,
  Tooltip,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { KinhPhiNam } from "@/interfaces";
import { notifyError } from "@/utils/notification";
import ThemKinhPhiNam from "./ThemKinhPhiNam";
import SuaKinhPhiNam from "./SuaKinhPhiNam";

const { Title } = Typography;

interface DanhSachKinhPhiNamProps {
  /**
   * Danh sách kinh phí năm
   */
  dataSource: KinhPhiNam[];

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Callback khi thêm kinh phí năm
   */
  onAdd?: (values: any) => Promise<void>;

  /**
   * Callback khi sửa kinh phí năm
   */
  onEdit?: (id: number, values: any) => Promise<void>;

  /**
   * Callback khi xóa kinh phí năm
   */
  onDelete?: (id: number) => Promise<void>;

  /**
   * Chế độ readonly (ẩn nút thêm và cột hành động)
   */
  readonly?: boolean;
}

/**
 * Component Danh Sách Kinh Phí Năm
 */
function DanhSachKinhPhiNam({
  dataSource,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  readonly = false,
}: DanhSachKinhPhiNamProps) {
  const [themModalOpen, setThemModalOpen] = useState(false);
  const [suaModalOpen, setSuaModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<KinhPhiNam | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Xử lý thêm
   */
  const handleAdd = async (values: any) => {
    if (!onAdd) return;

    try {
      setActionLoading(true);
      await onAdd(values);
      setThemModalOpen(false);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError("Thêm thất bại", errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Xử lý sửa
   */
  const handleEdit = async (values: any) => {
    if (!onEdit || !selectedRecord) return;

    try {
      setActionLoading(true);
      await onEdit(selectedRecord.id, values);
      setSuaModalOpen(false);
      setSelectedRecord(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError("Cập nhật thất bại", errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Xử lý xóa
   */
  const handleDelete = async (id: number) => {
    if (!onDelete) return;

    try {
      setActionLoading(true);
      await onDelete(id);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError("Xóa thất bại", errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Columns definition
   */
  const columns: ColumnsType<KinhPhiNam> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Năm",
      dataIndex: "nam",
      key: "nam",
      width: 120,
      align: "center",
    },
    {
      title: "Kinh phí (VNĐ)",
      dataIndex: "kinh_phi",
      key: "kinh_phi",
      align: "right",
      render: (value?: number) =>
        value != null ? new Intl.NumberFormat("vi-VN").format(value) : "-",
    },
  ];

  // Thêm cột hành động nếu không readonly
  if (!readonly) {
    columns.push({
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
      render: (_text, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setSelectedRecord(record);
                setSuaModalOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa?"
            description="Bạn có chắc muốn xóa kinh phí năm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    });
  }

  return (
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
          Danh sách kinh phí
        </Title>

        {!readonly && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setThemModalOpen(true)}
          >
            Thêm
          </Button>
        )}
      </Flex>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading || actionLoading}
        pagination={false}
        size="small"
        bordered
      />

      {/* Modals */}
      {!readonly && (
        <>
          <ThemKinhPhiNam
            open={themModalOpen}
            onCancel={() => setThemModalOpen(false)}
            onSubmit={handleAdd}
            loading={actionLoading}
          />

          <SuaKinhPhiNam
            open={suaModalOpen}
            onCancel={() => {
              setSuaModalOpen(false);
              setSelectedRecord(null);
            }}
            onSubmit={handleEdit}
            loading={actionLoading}
            initialValues={selectedRecord}
          />
        </>
      )}
    </div>
  );
}

export default DanhSachKinhPhiNam;
