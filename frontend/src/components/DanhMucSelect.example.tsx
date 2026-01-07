/**
 * VÍ DỤ: Sử dụng DanhMucSelect trong form
 * File này để tham khảo, KHÔNG import vào project
 */

import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import {
  DanhMucSelect,
  useDanhMucs,
  useDanhMucsByModule,
} from "@/components/DanhMucSelect";

// ===== VÍ DỤ 1: Sử dụng DanhMucSelect component =====
export const Example1_SimpleForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Số hợp đồng"
        name="so_hop_dong"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      {/* Sử dụng DanhMucSelect - Đơn giản nhất */}
      <Form.Item label="Đơn vị phê duyệt" name="don_vi_phe_duyet">
        <DanhMucSelect
          maDanhMuc="DON_VI_PHE_DUYET"
          placeholder="Chọn đơn vị phê duyệt"
          allowClear
        />
      </Form.Item>

      <Form.Item label="Lĩnh vực khoa học" name="linh_vuc">
        <DanhMucSelect
          maDanhMuc="LINH_VUC_KHOA_HOC"
          placeholder="Chọn lĩnh vực"
          allowClear
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Lưu
      </Button>
    </Form>
  );
};

// ===== VÍ DỤ 2: Sử dụng useDanhMucs hook (nhiều select) =====
export const Example2_MultipleSelects = () => {
  const [form] = Form.useForm();

  // Load nhiều danh mục cùng lúc - CHỈ 1 API CALL
  const { loading, getOptions } = useDanhMucs([
    "DON_VI_PHE_DUYET",
    "LINH_VUC_KHOA_HOC",
  ]);

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Số hợp đồng"
        name="so_hop_dong"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      {/* Sử dụng Select bình thường với options từ hook */}
      <Form.Item label="Đơn vị phê duyệt" name="don_vi_phe_duyet">
        <Select
          placeholder="Chọn đơn vị phê duyệt"
          loading={loading}
          allowClear
        >
          {getOptions("DON_VI_PHE_DUYET").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Lĩnh vực khoa học" name="linh_vuc">
        <Select placeholder="Chọn lĩnh vực" loading={loading} allowClear>
          {getOptions("LINH_VUC_KHOA_HOC").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu
      </Button>
    </Form>
  );
};

// ===== VÍ DỤ 3: Sử dụng useDanhMucsByModule (theo module) =====
export const Example3_ModuleSelects = () => {
  const [form] = Form.useForm();

  // Load TẤT CẢ danh mục của module HOP_DONG
  const { loading, getOptions } = useDanhMucsByModule("HOP_DONG");

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Số hợp đồng"
        name="so_hop_dong"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Loại hợp đồng" name="loai_hop_dong">
        <Select placeholder="Chọn loại hợp đồng" loading={loading} allowClear>
          {getOptions("LOAI_HOP_DONG").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Trạng thái" name="trang_thai">
        <Select placeholder="Chọn trạng thái" loading={loading} allowClear>
          {getOptions("TRANG_THAI_HOP_DONG").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu
      </Button>
    </Form>
  );
};

// ===== VÍ DỤ 4: Kết hợp cả 3 cách =====
export const Example4_Combined = () => {
  const [form] = Form.useForm();

  // Load danh mục chung
  const { loading: loadingChung, getOptions: getOptionsChung } = useDanhMucs([
    "DON_VI_PHE_DUYET",
    "LINH_VUC_KHOA_HOC",
  ]);

  // Load danh mục của module HOP_DONG
  const { loading: loadingHopDong, getOptions: getOptionsHopDong } =
    useDanhMucsByModule("HOP_DONG");

  const loading = loadingChung || loadingHopDong;

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Số hợp đồng"
        name="so_hop_dong"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      {/* Danh mục chung */}
      <Form.Item label="Đơn vị phê duyệt" name="don_vi_phe_duyet">
        <Select loading={loadingChung} allowClear>
          {getOptionsChung("DON_VI_PHE_DUYET").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Lĩnh vực" name="linh_vuc">
        <Select loading={loadingChung} allowClear>
          {getOptionsChung("LINH_VUC_KHOA_HOC").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Danh mục module HOP_DONG */}
      <Form.Item label="Loại hợp đồng" name="loai_hop_dong">
        <Select loading={loadingHopDong} allowClear>
          {getOptionsHopDong("LOAI_HOP_DONG").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Trạng thái" name="trang_thai">
        <Select loading={loadingHopDong} allowClear>
          {getOptionsHopDong("TRANG_THAI_HOP_DONG").map((opt) => (
            <Select.Option key={opt} value={opt}>
              {opt}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu
      </Button>
    </Form>
  );
};
