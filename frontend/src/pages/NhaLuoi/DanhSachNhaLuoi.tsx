/**
 * Danh sách Nhà Lưới
 * Table với column filtering, pagination
 */

import { useState, useEffect } from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { NhaLuoi } from "@/interfaces";
import { nhaLuoiApi } from "@/services/api/nhaLuoiApi";
import { notifyError } from "@/utils/notification";
import dayjs from "dayjs";
import { useColumnFilter } from "@/hooks/useColumnFilter";

const { Text } = Typography;

interface DanhSachNhaLuoiProps {
  onEdit?: (record: NhaLuoi) => void;
  onDelete: (id: number) => void;
  refresh?: number;
}

/**
 * Component Danh sách nhà lưới
 */
function DanhSachNhaLuoi({ onEdit, onDelete, refresh }: DanhSachNhaLuoiProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<NhaLuoi[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `Tổng số ${total} bản ghi`,
    position: ["bottomCenter"],
  });

  // Custom hook cho column filtering
  const { getColumnSearchProps, getColumnNumberProps } = useColumnFilter();

  /**
   * Load dữ liệu từ API
   */
  useEffect(() => {
    loadData();
  }, [refresh]);

  const loadData = async (
    page: number = pagination.current || 1,
    pageSize: number = pagination.pageSize || 10,
    currentFilters: Record<string, string> = filters
  ) => {
    try {
      setLoading(true);
      const response = await nhaLuoiApi.getAll({
        page,
        limit: pageSize,
        ...currentFilters,
      });
      setDataSource(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.total,
        current: page,
        pageSize,
      }));
    } catch (error: any) {
      notifyError("Lỗi tải dữ liệu", error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý khi thay đổi table (pagination, filters)
   */
  const handleTableChange = (
    newPagination: TablePaginationConfig,
    tableFilters: Record<string, any>
  ) => {
    // Cập nhật filters
    const newFilters: Record<string, string> = {};
    Object.keys(tableFilters).forEach((key) => {
      if (tableFilters[key] && tableFilters[key].length > 0) {
        newFilters[key] = tableFilters[key][0];
      }
    });

    setFilters(newFilters);
    loadData(newPagination.current, newPagination.pageSize, newFilters);
  };

  /**
   * Định nghĩa các cột của bảng với column filtering
   */
  const columns: ColumnsType<NhaLuoi> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, __, index) => {
        const { current = 1, pageSize = 10 } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Tên nhà lưới",
      dataIndex: "ten_nha_luoi",
      key: "ten_nha_luoi",
      width: 250,
      fixed: "left",
      ...getColumnSearchProps("ten_nha_luoi", "Tên nhà lưới"),
      filteredValue: filters.ten_nha_luoi ? [filters.ten_nha_luoi] : null,
      onFilter: () => true,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text strong>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Khu",
      dataIndex: "khu",
      key: "khu",
      width: 100,
      align: "center",
      ...getColumnSearchProps("khu", "Khu"),
      filteredValue: filters.khu ? [filters.khu] : null,
      onFilter: () => true,
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: "Số bể",
      dataIndex: "so_be",
      key: "so_be",
      width: 100,
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Diện tích (m²)",
      dataIndex: "dien_tich",
      key: "dien_tich",
      width: 130,
      align: "right",
      ...getColumnNumberProps("dien_tich", "Diện tích"),
      filteredValue: filters.dien_tich ? [filters.dien_tich] : null,
      onFilter: () => true,
      render: (value) =>
        value ? (
          <Text>{new Intl.NumberFormat("vi-VN").format(value)}</Text>
        ) : (
          "-"
        ),
    },
    {
      title: "Địa điểm",
      dataIndex: "dia_diem",
      key: "dia_diem",
      width: 200,
      ellipsis: { showTitle: false },
      render: (value) =>
        value ? (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        ) : (
          "-"
        ),
    },
    {
      title: "Người cập nhật",
      dataIndex: ["nguoi_cap_nhat", "ho_ten"],
      key: "nguoi_cap_nhat",
      width: 150,
      ellipsis: { showTitle: false },
      render: (value) => value || "-",
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "ngay_cap_nhat",
      key: "ngay_cap_nhat",
      width: 160,
      align: "center",
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {onEdit && (
            <Tooltip title="Sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Xác nhận xóa"
            description={
              <>
                Bạn có chắc chắn muốn xóa nhà lưới này?
                <br />
                <Text type="danger">
                  <strong>Cảnh báo:</strong> Tất cả lần sử dụng và file liên
                  quan sẽ bị xóa!
                </Text>
              </>
            }
            onConfirm={() => record.id && onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
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
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      onChange={handleTableChange}
      pagination={pagination}
      scroll={{ x: 1200 }}
      bordered
      size="small"
    />
  );
}

export default DanhSachNhaLuoi;
