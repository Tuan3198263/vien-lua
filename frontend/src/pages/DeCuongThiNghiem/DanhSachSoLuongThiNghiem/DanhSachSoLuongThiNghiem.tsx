/**
 * Danh Sách Số Lượng Thí Nghiệm - Sub-module
 * Quản lý số lượng thí nghiệm cho từng đề cương
 */

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Popconfirm,
  Modal,
  Form,
  Flex,
  Tooltip,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd";
import { danhSachSoLuongThiNghiemApi } from "@/services/api/deCuongThiNghiemApi";
import { notifySuccess, notifyError } from "@/utils/notification";
import type { DanhSachSoLuongThiNghiem } from "@/interfaces/entities.interface";
import FormSoLuongThiNghiem from "./FormSoLuongThiNghiem";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

const { Title } = Typography;

interface DanhSachSoLuongThiNghiemProps {
  deCuongId: number;
}

/**
 * Component hiển thị danh sách số lượng thí nghiệm
 * - Hiển thị dạng table với pagination
 * - Cho phép thêm/sửa/xóa số lượng thí nghiệm
 */
function DanhSachSoLuongThiNghiem({
  deCuongId,
}: DanhSachSoLuongThiNghiemProps) {
  const [dataSource, setDataSource] = useState<DanhSachSoLuongThiNghiem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [form] = Form.useForm();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingRecord, setEditingRecord] =
    useState<DanhSachSoLuongThiNghiem | null>(null);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `Tổng số ${total} bản ghi`,
    position: ["bottomCenter"],
  });

  /**
   * Load dữ liệu từ API
   */
  useEffect(() => {
    loadData();
  }, [refresh, deCuongId]);

  const loadData = async (
    page: number = pagination.current || 1,
    pageSize: number = pagination.pageSize || 10
  ) => {
    try {
      setLoading(true);
      const response = await danhSachSoLuongThiNghiemApi.getAll(deCuongId);
      setDataSource(response);
      setPagination((prev) => ({
        ...prev,
        total: response.length,
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
   * Xử lý thay đổi pagination
   */
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    loadData(newPagination.current, newPagination.pageSize);
  };

  /**
   * Mở modal thêm mới
   */
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  /**
   * Mở modal sửa
   */
  const handleOpenEditModal = (record: DanhSachSoLuongThiNghiem) => {
    setModalMode("edit");
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  /**
   * Đóng modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  /**
   * Submit form (Thêm hoặc Sửa)
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setActionLoading(true);

      if (modalMode === "create") {
        await danhSachSoLuongThiNghiemApi.create(deCuongId, values);
        notifySuccess(SUCCESS_MESSAGES.CREATE);
      } else {
        await danhSachSoLuongThiNghiemApi.update(
          deCuongId,
          editingRecord!.id!,
          values
        );
        notifySuccess(SUCCESS_MESSAGES.UPDATE);
      }

      handleCloseModal();
      setRefresh((prev) => prev + 1);
    } catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      } else {
        const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
        notifyError(
          modalMode === "create"
            ? ERROR_MESSAGES.CREATE_FAILED
            : ERROR_MESSAGES.UPDATE_FAILED,
          errorMsg
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Xóa số lượng thí nghiệm
   */
  const handleDelete = async (id: number) => {
    try {
      setActionLoading(true);
      await danhSachSoLuongThiNghiemApi.delete(deCuongId, id);
      notifySuccess(SUCCESS_MESSAGES.DELETE);
      setRefresh((prev) => prev + 1);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError(ERROR_MESSAGES.DELETE_FAILED, errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Định nghĩa columns cho Table
   */
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (pagination.current! - 1) * pagination.pageSize! + index + 1,
    },
    {
      title: "Địa điểm",
      dataIndex: "dia_diem",
      key: "dia_diem",
      width: 200,
      ellipsis: { showTitle: false },
      render: (value: string) =>
        value ? (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        ) : (
          "-"
        ),
    },
    {
      title: "Vị trí",
      dataIndex: "vi_tri",
      key: "vi_tri",
      width: 150,
      ellipsis: { showTitle: false },
      render: (value: string) =>
        value ? (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        ) : (
          "-"
        ),
    },
    {
      title: "Diện tích (ha)",
      dataIndex: "dien_tich",
      key: "dien_tich",
      width: 150,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: DanhSachSoLuongThiNghiem) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
              title="Sửa"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa số lượng thí nghiệm"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                title="Xóa"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
          Danh sách số lượng thí nghiệm
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreateModal}
        >
          Thêm
        </Button>
      </Flex>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading || actionLoading}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        bordered
        size="small"
        scroll={{ x: 800 }}
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        title={
          modalMode === "create"
            ? "Thêm số lượng thí nghiệm"
            : "Sửa số lượng thí nghiệm"
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={actionLoading}
        okText={modalMode === "create" ? "Thêm" : "Lưu"}
        cancelText="Hủy"
        width={600}
      >
        <FormSoLuongThiNghiem form={form} initialValues={editingRecord} />
      </Modal>
    </div>
  );
}

export default DanhSachSoLuongThiNghiem;
