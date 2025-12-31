/**
 * Danh sách Vai Trò
 * Table với column filtering, pagination
 */

import { useState, useEffect } from "react";
import { Table, Space, Button, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { VaiTro } from "@/interfaces";
import { vaiTroApi } from "@/services/api/vaiTroApi";
import { notifyError } from "@/utils/notification";
import dayjs from "dayjs";
import { useColumnFilter } from "@/hooks/useColumnFilter";

interface DanhSachVaiTroProps {
  onEdit: (record: VaiTro) => void;
  onDelete: (id: number) => void;
  refresh?: number;
}

/**
 * Component Danh sách vai trò
 */
function DanhSachVaiTro({ onEdit, onDelete, refresh }: DanhSachVaiTroProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<VaiTro[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `Tổng số ${total} bản ghi`,
    position: ["bottomCenter"],
  });

  const { getColumnSearchProps, getColumnDateProps } = useColumnFilter();

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
      const response = await vaiTroApi.getAll({
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
   * Định nghĩa các cột của bảng
   */
  const columns: ColumnsType<VaiTro> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_, __, index) => {
        const { current = 1, pageSize = 10 } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Mã vai trò",
      dataIndex: "ma_vai_tro",
      key: "ma_vai_tro",
      width: 150,
      ...getColumnSearchProps("ma_vai_tro", "Mã vai trò"),
      filteredValue: filters.ma_vai_tro ? [filters.ma_vai_tro] : null,
      onFilter: () => true,
    },
    {
      title: "Tên vai trò",
      dataIndex: "ten_vai_tro",
      key: "ten_vai_tro",
      width: 200,
      ...getColumnSearchProps("ten_vai_tro", "Tên vai trò"),
      filteredValue: filters.ten_vai_tro ? [filters.ten_vai_tro] : null,
      onFilter: () => true,
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "ngay_cap_nhat",
      key: "ngay_cap_nhat",
      align: "right",
      width: 160,
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
      ...getColumnDateProps("ngay_cap_nhat", "Thời gian cập nhật"),
      filteredValue: filters.ngay_cap_nhat ? [filters.ngay_cap_nhat] : null,
      onFilter: () => true,
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa vai trò"
              description={`Bạn có chắc chắn muốn xóa vai trò "${record.ten_vai_tro}" không?`}
              onConfirm={() => onDelete(record.id!)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  /**
   * Xử lý thay đổi table (pagination, filters)
   */
  const handleTableChange = async (
    newPagination: TablePaginationConfig,
    tableFilters: Record<string, any>
  ) => {
    const apiFilters: Record<string, string> = {};
    Object.keys(tableFilters).forEach((key) => {
      const filterValue = tableFilters[key];
      if (filterValue && filterValue.length > 0) {
        apiFilters[key] = filterValue[0];
      }
    });

    setFilters(apiFilters);
    await loadData(
      newPagination.current || 1,
      newPagination.pageSize || 10,
      apiFilters
    );
  };

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={(newPagination, filters) =>
          handleTableChange(newPagination, filters)
        }
        rowKey="id"
        scroll={{ x: 700 }}
        size="small"
      />
    </Space>
  );
}

export default DanhSachVaiTro;
