/**
 * Danh sách File Hệ Thống (Tài Liệu)
 * Table đơn giản với column filtering, pagination
 * Chỉ xem, không có thêm/sửa/xóa
 */

import { useState, useEffect } from "react";
import { Table, Space, Button, Tooltip, Tag } from "antd";
import { EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FileHeThong } from "@/interfaces";
import { fileHeThongApi } from "@/services/api";
import { notifyError } from "@/utils/notification";
import { getFileUrl } from "@/utils/fileUrlCache";
import { useColumnFilter } from "@/hooks/useColumnFilter";
import dayjs from "dayjs";

/**
 * Component Danh sách file hệ thống
 */
function DanhSachFileHeThong() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<FileHeThong[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `Tổng số ${total} file`,
    position: ["bottomCenter"],
  });

  // Custom hook cho column filtering
  const { getColumnSearchProps } = useColumnFilter();

  /**
   * Load dữ liệu từ API
   */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (
    page: number = pagination.current || 1,
    pageSize: number = pagination.pageSize || 10,
    currentFilters: Record<string, string> = filters
  ) => {
    try {
      setLoading(true);
      const response = await fileHeThongApi.getAll({
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
   * Xử lý thay đổi pagination và filters
   */
  const handleTableChange = (
    newPagination: TablePaginationConfig,
    tableFilters: any
  ) => {
    // Chuyển đổi filters từ Table sang format cho API
    const newFilters: Record<string, string> = {};
    Object.keys(tableFilters).forEach((key) => {
      if (tableFilters[key] && tableFilters[key][0]) {
        newFilters[key] = tableFilters[key][0];
      }
    });

    setFilters(newFilters);
    loadData(newPagination.current, newPagination.pageSize, newFilters);
  };

  /**
   * Xem file trong tab mới
   */
  const handleViewFile = (record: FileHeThong) => {
    if (!record.url_xem) {
      notifyError("Không thể xem file", "URL không hợp lệ");
      return;
    }

    // Sử dụng cache URL
    const url = getFileUrl(record.id, record.url_xem);
    window.open(url, "_blank");
  };

  /**
   * Lấy màu tag theo loại file
   */
  const getFileTypeColor = (loaiFile: string): string => {
    if (loaiFile.startsWith("image/")) return "blue";
    if (loaiFile === "application/pdf") return "red";
    if (
      loaiFile === "application/msword" ||
      loaiFile ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "green";
    return "default";
  };

  /**
   * Lấy tên hiển thị cho loại file
   */
  const getFileTypeLabel = (loaiFile: string): string => {
    if (loaiFile.startsWith("image/")) return "Ảnh";
    if (loaiFile === "application/pdf") return "PDF";
    if (
      loaiFile === "application/msword" ||
      loaiFile ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "Word";
    if (loaiFile === "text/plain") return "Text";
    return "File";
  };

  /**
   * Định nghĩa các cột của bảng
   */
  const columns: ColumnsType<FileHeThong> = [
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
      title: "Tên File",
      dataIndex: "ten_goc",
      key: "ten_goc",
      width: 250,
      ...getColumnSearchProps("ten_goc", "Tên file"),
      filteredValue: filters.ten_goc ? [filters.ten_goc] : null,
      onFilter: () => true,
      render: (text: string, record: FileHeThong) => (
        <Space>
          <FileTextOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Loại File",
      dataIndex: "loai_file",
      key: "loai_file",
      width: 120,
      ...getColumnSearchProps("loai_file", "Loại file"),
      filteredValue: filters.loai_file ? [filters.loai_file] : null,
      onFilter: () => true,
      render: (loaiFile: string) => (
        <Tag color={getFileTypeColor(loaiFile)}>
          {getFileTypeLabel(loaiFile)}
        </Tag>
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: 140,
      ...getColumnSearchProps("module", "Module"),
      filteredValue: filters.module ? [filters.module] : null,
      onFilter: () => true,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Người Cập Nhật",
      key: "nguoi_cap_nhat",
      width: 160,
      render: (_: any, record: FileHeThong) => {
        return record.nguoi_cap_nhat_info?.ho_ten || "-";
      },
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "ngay_cap_nhat",
      key: "ngay_cap_nhat",
      align: "right",
      width: 160,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành Động",
      key: "action",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_: any, record: FileHeThong) => (
        <Space size="small">
          <Tooltip title="Xem file">
            <Button
              type="link"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewFile(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        size="small"
      />
    </div>
  );
}

export default DanhSachFileHeThong;
