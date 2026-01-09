/**
 * Danh Sách Sản Phẩm Dự Kiến - Sub-module Component
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
import type { SanPham } from "@/interfaces";
import { notifyError } from "@/utils/notification";
import ThemSanPham from "./ThemSanPham";
import SuaSanPham from "./SuaSanPham";

const { Title } = Typography;

interface DanhSachSanPhamProps {
  dataSource: SanPham[];
  loading?: boolean;
  onAdd?: (values: any) => Promise<void>;
  onEdit?: (id: number, values: any) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  readonly?: boolean;
}

function DanhSachSanPham({
  dataSource,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  readonly = false,
}: DanhSachSanPhamProps) {
  const [themModalOpen, setThemModalOpen] = useState(false);
  const [suaModalOpen, setSuaModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SanPham | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleEdit = async (values: any) => {
    if (!onEdit || !selectedRecord) return;
    try {
      setActionLoading(true);
      await onEdit(selectedRecord.id!, values);
      setSuaModalOpen(false);
      setSelectedRecord(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError("Cập nhật thất bại", errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

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

  const columns: ColumnsType<SanPham> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
    },
  ];

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
            description="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => record.id && handleDelete(record.id)}
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
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
          Danh sách sản phẩm dự kiến
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

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading || actionLoading}
        pagination={false}
        size="small"
        bordered
      />

      {!readonly && (
        <>
          <ThemSanPham
            open={themModalOpen}
            onCancel={() => setThemModalOpen(false)}
            onSubmit={handleAdd}
            loading={actionLoading}
          />

          <SuaSanPham
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

export default DanhSachSanPham;
