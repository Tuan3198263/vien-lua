/**
 * DanhMucSelect Component
 * Component Select tự động load options từ API danh mục
 *
 * Sử dụng:
 * <DanhMucSelect maDanhMuc="DON_VI_PHE_DUYET" value={value} onChange={setValue} />
 */

import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd";
import { danhMucApi, DanhMucInfo } from "@/services/api";

interface DanhMucSelectProps extends Omit<SelectProps, "options"> {
  /**
   * Mã danh mục cần load (VD: DON_VI_PHE_DUYET)
   */
  maDanhMuc: string;

  /**
   * Label hiển thị (optional)
   */
  label?: string;
}

/**
 * Component Select với options từ danh mục
 * Tự động fetch và cache data
 */
export const DanhMucSelect: React.FC<DanhMucSelectProps> = ({
  maDanhMuc,
  label,
  placeholder,
  ...selectProps
}) => {
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
      console.error("Lỗi load danh mục:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {label && <div style={{ marginBottom: 4 }}>{label}</div>}
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
    </div>
  );
};

/**
 * Hook để load nhiều danh mục cùng lúc
 * Dùng khi form có nhiều select danh mục
 *
 * Ví dụ:
 * const danhMucs = useDanhMucs(['DON_VI_PHE_DUYET', 'LINH_VUC_KHOA_HOC']);
 */
export const useDanhMucs = (maDanhMucs: string[]) => {
  const [loading, setLoading] = useState(false);
  const [danhMucs, setDanhMucs] = useState<Record<string, DanhMucInfo>>({});

  useEffect(() => {
    if (maDanhMucs.length === 0) return;
    loadDanhMucs();
  }, [JSON.stringify(maDanhMucs)]);

  const loadDanhMucs = async () => {
    try {
      setLoading(true);
      const data = await danhMucApi.layNhieu(maDanhMucs);

      // Convert array to object for easy lookup
      const danhMucMap: Record<string, DanhMucInfo> = {};
      data.forEach((dm) => {
        danhMucMap[dm.ma_danh_muc] = dm;
      });

      setDanhMucs(danhMucMap);
    } catch (error) {
      console.error("Lỗi load danh mục:", error);
      setDanhMucs({});
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper function để lấy options của 1 danh mục
   */
  const getOptions = (maDanhMuc: string): string[] => {
    return danhMucs[maDanhMuc]?.danh_sach_gia_tri || [];
  };

  return {
    loading,
    danhMucs,
    getOptions,
  };
};

/**
 * Hook để load tất cả danh mục của 1 module
 * Dùng khi module có nhiều select danh mục
 *
 * Ví dụ:
 * const { danhMucs, getOptions } = useDanhMucsByModule('HOP_DONG');
 * const loaiHopDongOptions = getOptions('LOAI_HOP_DONG');
 */
export const useDanhMucsByModule = (module: string) => {
  const [loading, setLoading] = useState(false);
  const [danhMucs, setDanhMucs] = useState<Record<string, DanhMucInfo>>({});

  useEffect(() => {
    if (!module) return;
    loadDanhMucs();
  }, [module]);

  const loadDanhMucs = async () => {
    try {
      setLoading(true);
      const data = await danhMucApi.layTheoModule(module);

      const danhMucMap: Record<string, DanhMucInfo> = {};
      data.forEach((dm) => {
        danhMucMap[dm.ma_danh_muc] = dm;
      });

      setDanhMucs(danhMucMap);
    } catch (error) {
      console.error("Lỗi load danh mục:", error);
      setDanhMucs({});
    } finally {
      setLoading(false);
    }
  };

  const getOptions = (maDanhMuc: string): string[] => {
    return danhMucs[maDanhMuc]?.danh_sach_gia_tri || [];
  };

  return {
    loading,
    danhMucs,
    getOptions,
  };
};
