/**
 * Danh sách Đề Tài
 * Table với column filtering, pagination
 */

import { useState, useEffect } from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeTai } from "@/interfaces";
import { deTaiApi } from "@/services/api/deTaiApi";
import { notifyError } from "@/utils/notification";
import dayjs from "dayjs";
import { useColumnFilter } from "@/hooks/useColumnFilter";

const { Text } = Typography;

interface DanhSachDeTaiProps {
  onView?: (record: DeTai) => void;
  onEdit: (record: DeTai) => void;
  onDelete: (id: number) => void;
  refresh?: number;
  onDataChange?: (hasData: boolean) => void; // Callback khi data thay đổi
  onFilterChange?: (filters: Record<string, any>) => void; // Callback khi filter thay đổi
}

/**
 * Component Danh sách đề tài
 */
function DanhSachDeTai({
  onView,
  onEdit,
  onDelete,
  refresh,
  onDataChange,
  onFilterChange,
}: DanhSachDeTaiProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DeTai[]>([]);
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
      const response = await deTaiApi.getAll({
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

      // Notify parent về trạng thái data
      onDataChange?.(response.data.length > 0);
    } catch (error: any) {
      notifyError("Lỗi tải dữ liệu", error.message);
      onDataChange?.(false);
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
    onFilterChange?.(newFilters); // Notify parent về filters mới
    loadData(newPagination.current, newPagination.pageSize, newFilters);
  };

  /**
   * Định nghĩa các cột của bảng với column filtering
   */
  const columns: ColumnsType<DeTai> = [
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
      title: "Mã đề tài",
      dataIndex: "ma_de_tai",
      key: "ma_de_tai",
      width: 120,
      fixed: "left",
      ...getColumnSearchProps("ma_de_tai", "Mã đề tài"),
      filteredValue: filters.ma_de_tai ? [filters.ma_de_tai] : null,
      onFilter: () => true,
      render: (value) => value || "-",
    },
    {
      title: "Thông tin chung đề tài",
      children: [
        {
          title: "Tên đề tài",
          dataIndex: "ten_de_tai",
          key: "ten_de_tai",
          width: 250,
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
          title: "Đơn vị phê duyệt",
          dataIndex: "don_vi_phe_duyet",
          key: "don_vi_phe_duyet",
          width: 200,
          ...getColumnSearchProps("don_vi_phe_duyet", "Đơn vị phê duyệt"),
          filteredValue: filters.don_vi_phe_duyet
            ? [filters.don_vi_phe_duyet]
            : null,
          onFilter: () => true,
          ellipsis: { showTitle: false },
          render: (value) => (
            <Tooltip title={value} placement="topLeft">
              {value}
            </Tooltip>
          ),
        },
      ],
    },
    {
      title: "Cấp quản lý",
      dataIndex: "cap_quan_ly_de_tai",
      key: "cap_quan_ly_de_tai",
      width: 150,
      ...getColumnSearchProps("cap_quan_ly_de_tai", "Cấp quản lý đề tài"),
      filteredValue: filters.cap_quan_ly_de_tai
        ? [filters.cap_quan_ly_de_tai]
        : null,
      onFilter: () => true,
      ellipsis: true,
    },
    {
      title: "Phương thức khoáng chi",
      dataIndex: "phuong_thuc_khoang_chi",
      key: "phuong_thuc_khoang_chi",
      width: 180,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Nội dung khoáng chi",
      dataIndex: "noi_dung_khoang_chi",
      key: "noi_dung_khoang_chi",
      width: 200,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Lĩnh vực khoa học",
      dataIndex: "linh_vuc_khoa_hoc",
      key: "linh_vuc_khoa_hoc",
      width: 170,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Nguồn gốc",
      dataIndex: "nguon_goc_de_tai",
      key: "nguon_goc_de_tai",
      width: 150,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Hợp đồng",
      dataIndex: "hop_dong",
      key: "hop_dong",
      width: 150,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Biên bản thanh lý",
      dataIndex: "bien_ban_thanh_ly",
      key: "bien_ban_thanh_ly",
      width: 150,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Thời gian thực hiện",
      children: [
        {
          title: "Ngày bắt đầu",
          dataIndex: "ngay_bat_dau",
          key: "ngay_bat_dau",
          width: 140,
          align: "center" as const,
          render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
          ...getColumnDateProps("ngay_bat_dau", "Ngày bắt đầu"),
          filteredValue: filters.ngay_bat_dau ? [filters.ngay_bat_dau] : null,
          onFilter: () => true,
        },
        {
          title: "Ngày kết thúc",
          dataIndex: "ngay_ket_thuc",
          key: "ngay_ket_thuc",
          width: 140,
          align: "center" as const,
          render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
          ...getColumnDateProps("ngay_ket_thuc", "Ngày kết thúc"),
          filteredValue: filters.ngay_ket_thuc ? [filters.ngay_ket_thuc] : null,
          onFilter: () => true,
        },
      ],
    },
    {
      title: "Chủ nhiệm đề tài",
      dataIndex: "chu_nhiem_de_tai",
      key: "chu_nhiem_de_tai",
      width: 150,
      ...getColumnSearchProps("chu_nhiem_de_tai", "Chủ nhiệm đề tài"),
      filteredValue: filters.chu_nhiem_de_tai
        ? [filters.chu_nhiem_de_tai]
        : null,
      onFilter: () => true,
      ellipsis: true,
    },
    {
      title: "Thư ký đề tài",
      dataIndex: "thu_ky_de_tai",
      key: "thu_ky_de_tai",
      width: 150,
      ellipsis: true,
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
      width: 160,
      align: "right",
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
          {onView && (
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => onView(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description={
              <>
                Bạn có chắc chắn muốn xóa đề tài này?
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
      scroll={{ x: 3000 }}
      size="middle"
      bordered
    />
  );
}

export default DanhSachDeTai;
