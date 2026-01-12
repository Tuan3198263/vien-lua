/**
 * Danh sách Đề Cương Thí Nghiệm
 * Table với column filtering, pagination
 */

import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  Typography,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeCuongThiNghiem } from "@/interfaces";
import { deCuongThiNghiemApi } from "@/services/api/deCuongThiNghiemApi";
import { notifyError } from "@/utils/notification";
import dayjs from "dayjs";
import { useColumnFilter } from "@/hooks/useColumnFilter";

const { Text } = Typography;

interface DanhSachDeCuongThiNghiemProps {
  onEdit?: (record: DeCuongThiNghiem) => void;
  onDelete: (id: number) => void;
  refresh?: number;
}

/**
 * Component Danh sách đề cương thí nghiệm
 */
function DanhSachDeCuongThiNghiem({
  onEdit,
  onDelete,
  refresh,
}: DanhSachDeCuongThiNghiemProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DeCuongThiNghiem[]>([]);
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
      const response = await deCuongThiNghiemApi.getAll({
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
   * Format số tiền
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  /**
   * Xem file
   */
  const handleViewFile = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  /**
   * Định nghĩa các cột của bảng với column filtering
   */
  const columns: ColumnsType<DeCuongThiNghiem> = [
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
      key: "ten_de_tai",
      width: 250,
      fixed: "left",
      ...getColumnSearchProps("ten_de_tai", "Tên đề tài"),
      filteredValue: filters.ten_de_tai ? [filters.ten_de_tai] : null,
      onFilter: () => true,
      ellipsis: { showTitle: false },
      render: (_, record) => {
        const value = record.deTai?.ten_de_tai;
        return (
          <Tooltip title={value} placement="topLeft">
            <Text strong>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: "Cấp đề tài",
      key: "cap_quan_ly_de_tai",
      width: 150,
      ...getColumnSearchProps("cap_quan_ly_de_tai", "Cấp đề tài"),
      filteredValue: filters.cap_quan_ly_de_tai
        ? [filters.cap_quan_ly_de_tai]
        : null,
      onFilter: () => true,
      render: (_, record) => {
        const value = record.deTai?.cap_quan_ly_de_tai;
        return value ? <Tag color="blue">{value}</Tag> : "-";
      },
    },
    {
      title: "Đơn vị phê duyệt",
      key: "don_vi_phe_duyet",
      width: 180,
      ...getColumnSearchProps("don_vi_phe_duyet", "Đơn vị phê duyệt"),
      filteredValue: filters.don_vi_phe_duyet
        ? [filters.don_vi_phe_duyet]
        : null,
      onFilter: () => true,
      ellipsis: { showTitle: false },
      render: (_, record) => {
        const value = record.deTai?.don_vi_phe_duyet;
        return value ? (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Chủ nhiệm đề tài",
      key: "chu_nhiem_de_tai",
      width: 180,
      ellipsis: { showTitle: false },
      render: (_, record) => {
        const value = record.deTai?.chu_nhiem_de_tai;
        return value ? (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Tên thí nghiệm",
      dataIndex: "ten_thi_nghiem",
      key: "ten_thi_nghiem",
      width: 250,
      ...getColumnSearchProps("ten_thi_nghiem", "Tên thí nghiệm"),
      filteredValue: filters.ten_thi_nghiem ? [filters.ten_thi_nghiem] : null,
      onFilter: () => true,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Text>{value}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Loại hình thí nghiệm",
      dataIndex: "loai_hinh_thi_nghiem",
      key: "loai_hinh_thi_nghiem",
      width: 180,
      ...getColumnSearchProps("loai_hinh_thi_nghiem", "Loại hình"),
      filteredValue: filters.loai_hinh_thi_nghiem
        ? [filters.loai_hinh_thi_nghiem]
        : null,
      onFilter: () => true,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Tag color="green">{value}</Tag>
        </Tooltip>
      ),
    },
    {
      title: "Kinh phí kỹ thuật",
      dataIndex: "kinh_phi_ky_thuat",
      key: "kinh_phi_ky_thuat",
      width: 150,
      align: "right",
      render: (value) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Kinh phí lao động",
      dataIndex: "kinh_phi_lao_dong",
      key: "kinh_phi_lao_dong",
      width: 150,
      align: "right",
      render: (value) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Kinh phí NVL",
      dataIndex: "kinh_phi_nguyen_vat_lieu",
      key: "kinh_phi_nguyen_vat_lieu",
      width: 150,
      align: "right",
      render: (value) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Mùa vụ",
      dataIndex: "mua_vu",
      key: "mua_vu",
      width: 120,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Tag>{value}</Tag>
        </Tooltip>
      ),
    },
    {
      title: "Người thực hiện",
      dataIndex: "nguoi_thuc_hien",
      key: "nguoi_thuc_hien",
      width: 200,
      ellipsis: { showTitle: false },
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          {value}
        </Tooltip>
      ),
    },
    {
      title: "File",
      dataIndex: "file_de_cuong",
      key: "file",
      width: 120,
      align: "center",
      render: (file) => {
        if (!file) return <Text type="secondary">Chưa có</Text>;
        return (
          <Space>
            <Tooltip title="Xem file">
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewFile(file.url_xem)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngay_bat_dau",
      key: "ngay_bat_dau",
      width: 120,
      align: "center",
      render: (value) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngay_ket_thuc",
      key: "ngay_ket_thuc",
      width: 120,
      align: "center",
      render: (value) => dayjs(value).format("DD/MM/YYYY"),
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
      width: 120,
      align: "center",
      fixed: "right",
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
                Bạn có chắc chắn muốn xóa đề cương thí nghiệm này?
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
      scroll={{ x: 3000 }}
      bordered
      size="small"
    />
  );
}

export default DanhSachDeCuongThiNghiem;
