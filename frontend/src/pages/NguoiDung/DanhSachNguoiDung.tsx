/**
 * Danh sách Người Dùng
 * Table với column filtering, pagination
 * Version 2.0: Xóa bộ lọc chung, sử dụng filter dropdown cho từng cột
 */

import { useState, useEffect } from "react";
import { Table, Space, Button, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { NguoiDung } from "@/interfaces";
import { nguoiDungApi } from "@/services/api/nguoiDungApi";
import { notifyError } from "@/utils/notification";
import dayjs from "dayjs";
import { useColumnFilter } from "@/hooks/useColumnFilter";

interface DanhSachNguoiDungProps {
  onEdit: (record: NguoiDung) => void;
  onDelete: (id: number) => void;
  refresh?: number;
}

/**
 * Component Danh sách người dùng
 */
function DanhSachNguoiDung({
  onEdit,
  onDelete,
  refresh,
}: DanhSachNguoiDungProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<NguoiDung[]>([]);
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
      const response = await nguoiDungApi.getAll({
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
   * Định nghĩa các cột của bảng với column filtering
   */
  const columns: ColumnsType<NguoiDung> = [
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
      title: "Tài khoản",
      dataIndex: "tai_khoan",
      key: "tai_khoan",
      width: 140,
      ...getColumnSearchProps("tai_khoan", "Tài khoản"),
      filteredValue: filters.tai_khoan ? [filters.tai_khoan] : null,
      onFilter: () => true, // Server-side filtering
    },
    {
      title: "Vai trò",
      dataIndex: ["vai_tro", "ten_vai_tro"],
      key: "vai_tro",
      width: 120,
    },
    {
      title: "Họ tên",
      dataIndex: "ho_ten",
      key: "ho_ten",
      width: 160,
      ...getColumnSearchProps("ho_ten", "Họ tên"),
      filteredValue: filters.ho_ten ? [filters.ho_ten] : null,
      onFilter: () => true, // Server-side filtering
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ...getColumnSearchProps("email", "Email"),
      filteredValue: filters.email ? [filters.email] : null,
      onFilter: () => true, // Server-side filtering
    },
    {
      title: "Sdt",
      dataIndex: "sdt",
      key: "sdt",
      width: 100,
      render: (value) => value || "-",
      ...getColumnSearchProps("sdt", "Số điện thoại"),
      filteredValue: filters.sdt ? [filters.sdt] : null,
      onFilter: () => true, // Server-side filtering
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "ngay_cap_nhat",
      key: "ngay_cap_nhat",
      width: 160,
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
      ...getColumnDateProps("ngay_cap_nhat", "Thời gian cập nhật"),
      filteredValue: filters.ngay_cap_nhat ? [filters.ngay_cap_nhat] : null,
      onFilter: () => true, // Server-side filtering
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
              title="Xóa người dùng"
              description={`Bạn có chắc chắn muốn xóa người dùng "${record.tai_khoan}" không?`}
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
   * Xử lý thay đổi table (pagination, filters, sorter)
   * Filters được apply tự động từ column filterDropdown
   */
  const handleTableChange = async (
    newPagination: TablePaginationConfig,
    tableFilters: Record<string, any>
  ) => {
    console.log("[📋 handleTableChange] Called with:", {
      newPagination,
      tableFilters,
    });

    // Chuyển đổi filters từ Table sang dạng API params
    const apiFilters: Record<string, string> = {};
    Object.keys(tableFilters).forEach((key) => {
      const filterValue = tableFilters[key];
      if (filterValue && filterValue.length > 0) {
        // Ant Design filters trả về mảng, lấy phần tử đầu tiên
        apiFilters[key] = filterValue[0];
      }
    });

    console.log("[📋 handleTableChange] Converted apiFilters:", apiFilters);

    setFilters(apiFilters);
    await loadData(
      newPagination.current || 1,
      newPagination.pageSize || 10,
      apiFilters
    );
  };

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      {/* Bảng dữ liệu với column filtering tích hợp */}
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

export default DanhSachNguoiDung;
