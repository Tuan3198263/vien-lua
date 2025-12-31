/**
 * Danh sách Hợp Đồng
 * Table với column filtering, pagination
 */

import { useState, useEffect } from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Tag } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { HopDong } from "@/interfaces";
import { hopDongApi } from "@/services/api/hopDongApi";
import { notifyError } from "@/utils/notification";
import dayjs from "dayjs";
import { useColumnFilter } from "@/hooks/useColumnFilter";

interface DanhSachHopDongProps {
  onEdit: (record: HopDong) => void;
  onDelete: (id: number) => void;
  refresh?: number;
}

/**
 * Component Danh sách hợp đồng
 */
function DanhSachHopDong({ onEdit, onDelete, refresh }: DanhSachHopDongProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<HopDong[]>([]);
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
      const response = await hopDongApi.getAll({
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
   * Định nghĩa các cột của bảng với column filtering
   */
  const columns: ColumnsType<HopDong> = [
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
      title: "Số hợp đồng",
      dataIndex: "so_hop_dong",
      key: "so_hop_dong",
      width: 180,
      ...getColumnSearchProps("so_hop_dong", "Số hợp đồng"),
      filteredValue: filters.so_hop_dong ? [filters.so_hop_dong] : null,
      onFilter: () => true,
    },
    {
      title: "Đối tác",
      dataIndex: "doi_tac",
      key: "doi_tac",
      width: 200,
      ...getColumnSearchProps("doi_tac", "Đối tác"),
      filteredValue: filters.doi_tac ? [filters.doi_tac] : null,
      onFilter: () => true,
    },
    {
      title: "File đính kèm",
      key: "file_hop_dong",
      width: 120,
      align: "center",
      render: (_, record) => {
        if (record.file_hop_dong && record.file_hop_dong.url_xem) {
          return (
            <Tooltip title={record.file_hop_dong.ten_goc}>
              <Button
                type="link"
                icon={<FileTextOutlined />}
                onClick={() =>
                  window.open(record.file_hop_dong!.url_xem, "_blank")
                }
              >
                Xem
              </Button>
            </Tooltip>
          );
        }
        return <Tag color="default">Không có</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      width: 200,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Người cập nhật",
      dataIndex: ["nguoi_cap_nhat", "ho_ten"],
      key: "nguoi_cap_nhat",
      width: 150,
      render: (value) => value || "-",
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
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa hợp đồng này?"
            onConfirm={() => record.id && onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
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
      rowKey="id"
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
      scroll={{ x: 1200 }}
      size="middle"
    />
  );
}

export default DanhSachHopDong;
