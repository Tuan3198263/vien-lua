/**
 * ApiSelect Component
 * Component Select tự động load options từ API
 *
 * Sử dụng:
 * <ApiSelect maDanhMuc="DON_VI_PHE_DUYET" value={value} onChange={setValue} />
 */

import { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import type { SelectProps } from "antd";
import { danhMucApi } from "@/services/api";

interface ApiSelectProps extends Omit<SelectProps, "options"> {
  /**
   * Mã danh mục cần load (VD: DON_VI_PHE_DUYET)
   */
  maDanhMuc: string;
}

/**
 * Component Select với options từ API
 * Tự động fetch data khi mount
 */
export function ApiSelect({
  maDanhMuc,
  placeholder,
  ...selectProps
}: ApiSelectProps) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    loadOptions();
  }, [maDanhMuc]);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const danhMuc = await danhMucApi.layTheoMa(maDanhMuc);
      setOptions(danhMuc.danh_sach_gia_tri);
    } catch (error) {
      message.error(`Không thể tải danh mục ${maDanhMuc}`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      placeholder={placeholder || "Chọn..."}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "Không có dữ liệu"}
      {...selectProps}
    >
      {options.map((opt) => (
        <Select.Option key={opt} value={opt}>
          {opt}
        </Select.Option>
      ))}
    </Select>
  );
}
