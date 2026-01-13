/**
 * Danh Sách Lần Sử Dụng Nhà Lưới - Sub-module Component
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
import type { LanSuDung } from "@/interfaces";
import FormLanSuDung from "./FormLanSuDung";
import { notifyError, notifySuccess } from "@/utils/notification";
import { lanSuDungApi } from "@/services/api/nhaLuoiApi";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface DanhSachLanSuDungProps {
  nhaLuoiId: number;
}

function DanhSachLanSuDung({ nhaLuoiId }: DanhSachLanSuDungProps) {
  const [dataSource, setDataSource] = useState<LanSuDung[]>([]);
  const [loading, setLoading] = useState(false);
  const [themModalOpen, setThemModalOpen] = useState(false);
  const [suaModalOpen, setSuaModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LanSuDung | null>(null);
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
  }, [nhaLuoiId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await lanSuDungApi.getAll(nhaLuoiId);
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

      const payload = {
        ...values,
        ngay_muon:
          values.ngay_muon && dayjs(values.ngay_muon).isValid()
            ? dayjs(values.ngay_muon).format("YYYY-MM-DD")
            : undefined,
        ngay_tra:
          values.ngay_tra && dayjs(values.ngay_tra).isValid()
            ? dayjs(values.ngay_tra).format("YYYY-MM-DD")
            : undefined,
      };

      await lanSuDungApi.create(nhaLuoiId, payload, uploadFile || undefined);
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

      const payload = {
        ...values,
        ngay_muon:
          values.ngay_muon && dayjs(values.ngay_muon).isValid()
            ? dayjs(values.ngay_muon).format("YYYY-MM-DD")
            : undefined,
        ngay_tra:
          values.ngay_tra && dayjs(values.ngay_tra).isValid()
            ? dayjs(values.ngay_tra).format("YYYY-MM-DD")
            : undefined,
      };

      await lanSuDungApi.update(
        nhaLuoiId,
        selectedRecord.id,
        payload,
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
      await lanSuDungApi.delete(nhaLuoiId, id);
      notifySuccess(SUCCESS_MESSAGES.DELETE);
      loadData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
      notifyError(ERROR_MESSAGES.DELETE_FAILED, errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const columns: ColumnsType<LanSuDung> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Tên thí nghiệm",
      dataIndex: "ten_thi_nghiem",
      key: "ten_thi_nghiem",
      width: 200,
      render: (_: any, record: LanSuDung) =>
        record.deCuongThiNghiem?.ten_thi_nghiem || "-",
    },
    {
      title: "Người thực hiện",
      dataIndex: "nguoi_thuc_hien",
      key: "nguoi_thuc_hien",
      width: 150,
      render: (_: any, record: LanSuDung) =>
        record.deCuongThiNghiem?.nguoi_thuc_hien || "-",
    },
    {
      title: "Đề tài",
      dataIndex: "de_tai",
      key: "de_tai",
      width: 200,
      render: (_: any, record: LanSuDung) =>
        record.deCuongThiNghiem?.deTai?.ten_de_tai || "-",
    },
    {
      title: "Cấp quản lý",
      dataIndex: "cap_quan_ly",
      key: "cap_quan_ly",
      width: 120,
      render: (_: any, record: LanSuDung) =>
        record.deCuongThiNghiem?.deTai?.cap_quan_ly_de_tai || "-",
    },
    {
      title: "Dụng cụ",
      dataIndex: "dung_cu",
      key: "dung_cu",
      width: 100,
      render: (dungCu: string) => dungCu || "-",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
      width: 80,
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Ngày mượn",
      dataIndex: "ngay_muon",
      key: "ngay_muon",
      width: 120,
      align: "right",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Ngày trả",
      dataIndex: "ngay_tra",
      key: "ngay_tra",
      width: 120,
      align: "right",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Khấu hao (%)",
      dataIndex: "khau_hao",
      key: "khau_hao",
      width: 100,
      align: "right",
      render: (value) => value || "-",
    },
    {
      title: "Hiện trạng",
      dataIndex: "hien_trang",
      key: "hien_trang",
      width: 150,
      render: (hienTrang: string) => {
        if (!hienTrang) return "-";
        const color = hienTrang.includes("Tốt") ? "green" : "orange";
        return <Tag color={color}>{hienTrang}</Tag>;
      },
    },
    {
      title: "File",
      dataIndex: "file_lan_su_dung",
      key: "file_lan_su_dung",
      width: 120,
      align: "center",
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
                Bạn có chắc muốn xóa lần sử dụng này?
                {record.file_lan_su_dung && (
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
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
          Danh sách lần sử dụng
        </Title>
        <Button
          type="primary"
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
        scroll={{ x: 1800 }}
      />

      {/* Modal Thêm */}
      <Modal
        title="Thêm lần sử dụng"
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
        width={900}
        style={{ top: 24 }}
      >
        <FormLanSuDung form={themForm} onFileChange={setUploadFile} />
      </Modal>

      {/* Modal Sửa */}
      <Modal
        title="Sửa lần sử dụng"
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
        width={900}
        style={{ top: 24 }}
      >
        <FormLanSuDung
          form={suaForm}
          initialValues={selectedRecord || undefined}
          onFileChange={setUploadFile}
          onDeleteFileChange={setDeleteCurrentFile}
          existingFile={selectedRecord?.file_lan_su_dung}
        />
      </Modal>
    </div>
  );
}

export default DanhSachLanSuDung;
