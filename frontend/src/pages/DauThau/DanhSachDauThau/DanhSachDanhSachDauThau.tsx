/**
 * Danh Sách Đấu Thầu - Sub-module Component
 */

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Flex,
  Typography,
  Popconfirm,
  Space,
  Modal,
  Form,
  Tooltip,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { DanhSachDauThau } from "@/interfaces";
import FormDanhSachDauThau from "../DanhSachDauThau/FormDanhSachDauThau";
import { notifyError, notifySuccess } from "@/utils/notification";
import { danhSachDauThauApi } from "@/services/api/dauThauApi";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

const { Title, Text } = Typography;

interface DanhSachDanhSachDauThauProps {
  dauThauId: number;
}

function DanhSachDanhSachDauThau({ dauThauId }: DanhSachDanhSachDauThauProps) {
  const [dataSource, setDataSource] = useState<DanhSachDauThau[]>([]);
  const [loading, setLoading] = useState(false);
  const [themModalOpen, setThemModalOpen] = useState(false);
  const [suaModalOpen, setSuaModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DanhSachDauThau | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [themForm] = Form.useForm();
  const [suaForm] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [deleteCurrentFile, setDeleteCurrentFile] = useState(false);

  /**
   * Load dữ liệu
   */
  useEffect(() => {
    loadData();
  }, [dauThauId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await danhSachDauThauApi.getAll(dauThauId);
      setDataSource(data);
    } catch (error: any) {
      notifyError("Lỗi tải dữ liệu", error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý thêm mới
   */
  const handleAdd = async () => {
    try {
      const values = await themForm.validateFields();
      setActionLoading(true);
      await danhSachDauThauApi.create(
        dauThauId,
        values,
        uploadFile || undefined
      );
      notifySuccess(SUCCESS_MESSAGES.CREATE);
      setThemModalOpen(false);
      themForm.resetFields();
      setUploadFile(null);
      loadData();
    } catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      } else {
        const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
        notifyError(ERROR_MESSAGES.CREATE_FAILED, errorMsg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Xử lý cập nhật
   */
  const handleEdit = async () => {
    if (!selectedRecord || !selectedRecord.id) return;
    try {
      const values = await suaForm.validateFields();
      setActionLoading(true);
      await danhSachDauThauApi.update(
        dauThauId,
        selectedRecord.id,
        values,
        uploadFile || undefined,
        deleteCurrentFile
      );
      notifySuccess(SUCCESS_MESSAGES.UPDATE);
      setSuaModalOpen(false);
      setSelectedRecord(null);
      setUploadFile(null);
      setDeleteCurrentFile(false);
      loadData();
    } catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      } else {
        const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
        notifyError(ERROR_MESSAGES.UPDATE_FAILED, errorMsg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Xử lý xóa
   */
  const handleDelete = async (id: number) => {
    try {
      setActionLoading(true);
      await danhSachDauThauApi.delete(dauThauId, id);
      notifySuccess(SUCCESS_MESSAGES.DELETE);
      loadData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError(ERROR_MESSAGES.DELETE_FAILED, errorMsg);
    } finally {
      setActionLoading(false);
    }
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

  const columns: ColumnsType<DanhSachDauThau> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Năm",
      dataIndex: "nam",
      key: "nam",
      width: 100,
      align: "center",
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: "Kinh phí",
      dataIndex: "kinh_phi",
      key: "kinh_phi",
      width: 150,
      align: "right",
      render: (value) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Hình thức",
      dataIndex: "hinh_thuc",
      key: "hinh_thuc",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Bước",
      dataIndex: "buoc",
      key: "buoc",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "File",
      dataIndex: "file_dau_thau",
      key: "file_dau_thau",
      width: 200,
      render: (file: any) => {
        if (!file) return <span style={{ color: "#999" }}>Không có file</span>;
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            href={file.url_xem}
            target="_blank"
          >
            {file.ten_goc || "Xem file"}
          </Button>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
      fixed: "right",
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
            description={
              <>
                Bạn có chắc muốn xóa danh sách đấu thầu này?
                {record.file_dau_thau && (
                  <>
                    <br />
                    <Text type="danger">
                      <strong>Cảnh báo:</strong> File đính kèm sẽ bị xóa!
                    </Text>
                  </>
                )}
              </>
            }
            onConfirm={() => record.id && handleDelete(record.id)}
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
    <Flex vertical gap="middle" style={{ padding: "16px 24px" }}>
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={5} style={{ margin: 0 }}>
          Danh sách đấu thầu
        </Title>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setThemModalOpen(true)}
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
        pagination={false}
        bordered
        size="small"
        scroll={{ x: 800 }}
      />

      {/* Modal Thêm */}
      <Modal
        title="Thêm danh sách đấu thầu"
        open={themModalOpen}
        onOk={handleAdd}
        onCancel={() => {
          setThemModalOpen(false);
          themForm.resetFields();
          setUploadFile(null);
        }}
        confirmLoading={actionLoading}
        okText="Thêm"
        cancelText="Hủy"
        width={600}
      >
        <FormDanhSachDauThau form={themForm} onFileChange={setUploadFile} />
      </Modal>

      {/* Modal Sửa */}
      <Modal
        title="Sửa danh sách đấu thầu"
        open={suaModalOpen}
        onOk={handleEdit}
        onCancel={() => {
          setSuaModalOpen(false);
          setSelectedRecord(null);
          setUploadFile(null);
          setDeleteCurrentFile(false);
        }}
        confirmLoading={actionLoading}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <FormDanhSachDauThau
          form={suaForm}
          initialValues={selectedRecord || undefined}
          onFileChange={setUploadFile}
          onDeleteFileChange={setDeleteCurrentFile}
          existingFile={selectedRecord?.file_dau_thau}
        />
      </Modal>
    </Flex>
  );
}

export default DanhSachDanhSachDauThau;
