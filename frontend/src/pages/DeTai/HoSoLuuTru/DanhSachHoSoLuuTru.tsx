/**
 * Danh Sách Hồ Sơ Lưu Trữ - Sub-module Component
 */

import { useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { HoSoLuuTru } from "@/interfaces";
import FormHoSoLuuTru from "./FormHoSoLuuTru";
import { notifyError } from "@/utils/notification";

const { Title } = Typography;

interface DanhSachHoSoLuuTruProps {
  dataSource: HoSoLuuTru[];
  loading?: boolean;
  onAdd?: (values: any, file?: File) => Promise<void>;
  onEdit?: (
    id: number,
    values: any,
    file?: File,
    deleteFile?: boolean
  ) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  readonly?: boolean;
}

function DanhSachHoSoLuuTru({
  dataSource,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  readonly = false,
}: DanhSachHoSoLuuTruProps) {
  const [themModalOpen, setThemModalOpen] = useState(false);
  const [suaModalOpen, setSuaModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HoSoLuuTru | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [themForm] = Form.useForm();
  const [suaForm] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [deleteCurrentFile, setDeleteCurrentFile] = useState(false);

  const handleAdd = async () => {
    if (!onAdd) return;
    try {
      const values = await themForm.validateFields();
      setActionLoading(true);
      await onAdd(values, uploadFile || undefined);
      setThemModalOpen(false);
      themForm.resetFields();
      setUploadFile(null);
    } catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      } else {
        const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
        notifyError("Thêm thất bại", errorMsg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!onEdit || !selectedRecord || !selectedRecord.id) return;
    try {
      const values = await suaForm.validateFields();
      setActionLoading(true);
      await onEdit(
        selectedRecord.id,
        values,
        uploadFile || undefined,
        deleteCurrentFile
      );
      setSuaModalOpen(false);
      setSelectedRecord(null);
      setUploadFile(null);
      setDeleteCurrentFile(false);
    } catch (error: any) {
      if (error.errorFields && error.errorFields.length > 0) {
        notifyError("Lỗi nhập liệu", error.errorFields[0].errors[0]);
      } else {
        const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
        notifyError("Cập nhật thất bại", errorMsg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!onDelete) return;
    try {
      setActionLoading(true);
      await onDelete(id);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError("Xóa thất bại", errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const columns: ColumnsType<HoSoLuuTru> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Loại hồ sơ",
      dataIndex: "loai_ho_so",
      key: "loai_ho_so",
    },
    {
      title: "Năm",
      dataIndex: "nam",
      key: "nam",
      width: 100,
      align: "center",
    },
    {
      title: "File",
      dataIndex: "file_ho_so",
      key: "file_ho_so",
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
  ];

  if (!readonly) {
    columns.push({
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center",
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
            description="Bạn có chắc muốn xóa hồ sơ này?"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
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
    });
  }

  return (
    <div style={{ marginTop: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
          Hồ sơ lưu trữ
        </Title>
        {!readonly && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setThemModalOpen(true)}
          >
            Thêm
          </Button>
        )}
      </Flex>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading || actionLoading}
        pagination={false}
        size="small"
        bordered
      />

      {!readonly && (
        <>
          <Modal
            title="Thêm hồ sơ lưu trữ"
            open={themModalOpen}
            onOk={handleAdd}
            onCancel={() => {
              setThemModalOpen(false);
              themForm.resetFields();
              setUploadFile(null);
            }}
            confirmLoading={actionLoading}
            width={700}
            okText="Thêm"
            cancelText="Hủy"
          >
            <FormHoSoLuuTru
              form={themForm}
              onFileChange={(file) => setUploadFile(file)}
            />
          </Modal>

          <Modal
            title="Sửa hồ sơ lưu trữ"
            open={suaModalOpen}
            onOk={handleEdit}
            onCancel={() => {
              setSuaModalOpen(false);
              setSelectedRecord(null);
              setUploadFile(null);
              setDeleteCurrentFile(false);
            }}
            confirmLoading={actionLoading}
            width={700}
            okText="Lưu"
            cancelText="Hủy"
          >
            <FormHoSoLuuTru
              form={suaForm}
              initialValues={selectedRecord}
              onFileChange={(file) => setUploadFile(file)}
              onDeleteCurrentFile={() => setDeleteCurrentFile(true)}
            />
          </Modal>
        </>
      )}
    </div>
  );
}

export default DanhSachHoSoLuuTru;
