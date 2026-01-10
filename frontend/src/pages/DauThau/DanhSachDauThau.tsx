/**
 * Danh sách Đấu Thầu
 * Table với column filtering, pagination, expandable rows
 */

import { useState, useEffect } from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DauThau } from "@/interfaces";
import { dauThauApi } from "@/services/api/dauThauApi";
import { notifyError } from "@/utils/notification";
import dayjs from "dayjs";
import { useColumnFilter } from "@/hooks/useColumnFilter";

const { Text } = Typography;

interface DanhSachDauThauProps {
  onDelete: (id: number) => void;
  refresh?: number;
}

/**
 * Component Danh sách đấu thầu
 */
function DanhSachDauThau({ onDelete, refresh }: DanhSachDauThauProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DauThau[]>([]);
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
  const { getColumnSearchProps } = useColumnFilter();

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
      const response = await dauThauApi.getAll({
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
   * Xử lý khi thay đổi table (pagination, filters, sorter)
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
   * Format số tiền
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  /**
   * Định nghĩa các cột của bảng với column filtering
   */
  const columns: ColumnsType<DauThau> = [
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
      title: "Tên đề tài",
      dataIndex: ["deTai", "ten_de_tai"],
      key: "ten_de_tai",
      width: 250,
      fixed: "left",
      ...getColumnSearchProps("ten_de_tai", "Tên đề tài"),
      filteredValue: filters.ten_de_tai ? [filters.ten_de_tai] : null,
      onFilter: () => true,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text strong>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Năm",
      dataIndex: "nam_thuc_hien",
      key: "nam_thuc_hien",
      width: 120,
      align: "center",
      ...getColumnSearchProps("nam_thuc_hien", "Năm thực hiện"),
      filteredValue: filters.nam_thuc_hien ? [filters.nam_thuc_hien] : null,
      onFilter: () => true,
    },
    {
      title: "Tổng kinh phí",
      dataIndex: "tong_kinh_phi",
      key: "tong_kinh_phi",
      width: 150,
      align: "right",
      render: (value) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Nguồn kinh phí",
      dataIndex: "nguon_kinh_phi",
      key: "nguon_kinh_phi",
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
          <Popconfirm
            title="Xác nhận xóa"
            description={
              <>
                Bạn có chắc chắn muốn xóa đấu thầu này?
                <br />
                <Text type="danger">
                  <strong>Cảnh báo:</strong> Tất cả dữ liệu liên quan sẽ bị xóa!
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

export default DanhSachDauThau;
