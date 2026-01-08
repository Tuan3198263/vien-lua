/**
 * DanhMucSelect Component
 * Select dropdown lấy options từ constants danh mục
 */

import { Select } from "antd";
import type { SelectProps } from "antd";
import { taoOptionsTuDanhMuc } from "@/constants/danhMuc";

interface DanhMucSelectProps extends Omit<SelectProps, "options"> {
  /**
   * Mã danh mục (ví dụ: 'DON_VI_PHE_DUYET', 'LINH_VUC_KHOA_HOC')
   */
  maDanhMuc: string;

  /**
   * Cho phép nhập tự do (không chỉ chọn từ danh sách)
   */
  allowCustom?: boolean;
}

/**
 * Component Select với options từ danh mục constants
 *
 * @example
 * // Sử dụng trong Form
 * <Form.Item name="don_vi_phe_duyet" label="Đơn vị phê duyệt">
 *   <DanhMucSelect maDanhMuc="DON_VI_PHE_DUYET" placeholder="Chọn đơn vị" />
 * </Form.Item>
 *
 * @example
 * // Cho phép nhập tự do
 * <DanhMucSelect
 *   maDanhMuc="LOAI_HO_SO"
 *   allowCustom
 *   placeholder="Chọn hoặc nhập loại hồ sơ"
 * />
 */
function DanhMucSelect({
  maDanhMuc,
  allowCustom = false,
  ...props
}: DanhMucSelectProps) {
  const options = taoOptionsTuDanhMuc(maDanhMuc);

  return (
    <Select
      options={options}
      showSearch
      optionFilterProp="label"
      mode={allowCustom ? "tags" : undefined}
      maxTagCount={allowCustom ? 1 : undefined}
      {...props}
    />
  );
}

export default DanhMucSelect;
